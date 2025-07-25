import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi, vehiclesApi, driversApi } from '@/lib/api'
import type { Order } from '@/types'
import { OrdersTable } from '@/components/orders/OrdersTable'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { IconPlus } from '@tabler/icons-react'
import { toast } from 'sonner'

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [selectedDriver, setSelectedDriver] = useState('')

  const queryClient = useQueryClient()

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersApi.getAll({ limit: 100, sort: '-createdAt' })
      return response.data
    },
  })

  const { data: statsData } = useQuery({
    queryKey: ['orders-stats'],
    queryFn: async () => {
      const response = await ordersApi.getStats()
      return response.data
    },
  })

  const { data: vehiclesData } = useQuery({
    queryKey: ['available-vehicles'],
    queryFn: async () => {
      const response = await vehiclesApi.getAvailable()
      return response.data
    },
  })

  const { data: driversData } = useQuery({
    queryKey: ['available-drivers'],
    queryFn: async () => {
      const response = await driversApi.getAvailable()
      return response.data
    },
  })

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => ordersApi.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders-stats'] })
      toast.success('Order deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete order')
    },
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.update(orderId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders-stats'] })
      toast.success('Order status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update order status')
    },
  })

  const assignMutation = useMutation({
    mutationFn: ({ orderId, vehicleId, driverId }: { orderId: string, vehicleId: string, driverId: string }) =>
      ordersApi.assign(orderId, vehicleId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setAssignDialogOpen(false)
      setSelectedOrder(null)
      setSelectedVehicle('')
      setSelectedDriver('')
      toast.success('Order assigned successfully')
    },
    onError: () => {
      toast.error('Failed to assign order')
    },
  })

  const orders = ordersData?.data || []
  const stats = statsData?.data
  const vehicles = vehiclesData?.data || []
  const drivers = driversData?.data || []

  const handleView = (order: Order) => {
    // TODO: Implement order details modal/page
    console.log('View order:', order)
    toast.info(`Viewing order ${order.id}`)
  }

  const handleEdit = (order: Order) => {
    // TODO: Implement order edit modal/page
    console.log('Edit order:', order)
    toast.info(`Editing order ${order.id}`)
  }

  const handleDelete = (order: Order) => {
    if (confirm(`Are you sure you want to delete order ${order.id}?`)) {
      deleteOrderMutation.mutate(order._id)
    }
  }

  const handleAssign = (order: Order) => {
    setSelectedOrder(order)
    setAssignDialogOpen(true)
  }

  const handleAssignSubmit = () => {
    if (selectedOrder && selectedVehicle && selectedDriver) {
      assignMutation.mutate({
        orderId: selectedOrder.id,
        vehicleId: selectedVehicle,
        driverId: selectedDriver,
      })
    }
  }

  const handleStatusChange = (order: Order, status: string) => {
    updateOrderStatusMutation.mutate({
      orderId: order._id,
      status,
    })
  }

  const handleExport = (data: Order[]) => {
    // Simple CSV export
    const csvContent = [
      ['Order ID', 'Customer', 'Location', 'Type', 'Status', 'Packages', 'Amount', 'Created'],
      ...data.map(order => [
        order.id,
        order.customer?.name || '',
        order.location,
        order.type,
        order.status,
        order.packages.toString(),
        order.totalAmount?.toString() || '',
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success(`Exported ${data.length} orders`)
  }

  const handleRefresh = () => {
    refetch()
    toast.success('Orders refreshed')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track all pharmacy delivery orders
            </p>
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table skeleton */}
        <DataTableSkeleton
          columnCount={8}
          rowCount={10}
          searchableColumnCount={1}
          filterableColumnCount={2}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all pharmacy delivery orders
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.statusStats.find(s => s._id === 'to-be-fulfilled')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting fulfillment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.statusStats.find(s => s._id === 'in-transit')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently delivering
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.statusStats.find(s => s._id === 'completed')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A comprehensive list of all pharmacy delivery orders with advanced filtering and sorting capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssign={handleAssign}
            onStatusChange={handleStatusChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>

      {/* Assign Order Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Order</DialogTitle>
            <DialogDescription>
              Assign a vehicle and driver to order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle._id} value={vehicle.id}>
                      {vehicle.id} - {vehicle.type} ({vehicle.maxWeight})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="driver">Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver._id} value={driver.id}>
                      {driver.name} - {driver.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAssignSubmit}
              disabled={!selectedVehicle || !selectedDriver || assignMutation.isPending}
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}