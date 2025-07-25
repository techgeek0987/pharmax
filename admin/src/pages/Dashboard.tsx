import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import { MetricsGrid } from '@/components/dashboard/MetricsGrid'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart'
import { OrderTypeChart } from '@/components/dashboard/OrderTypeChart'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { IconRefresh, IconDownload, IconPlus } from '@tabler/icons-react'
import { formatDate } from '@/utils'

export function Dashboard() {
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await ordersApi.getStats()
      return response.data
    },
  })

  const { data: recentOrdersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await ordersApi.getAll({ limit: 10, sort: '-createdAt' })
      return response.data
    },
  })

  const stats = statsData?.data
  const recentOrders = recentOrdersData?.data || []

  const handleRefresh = () => {
    refetchStats()
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export dashboard data')
  }

  if (statsLoading && ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PharmX Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your pharmacy operations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDate(new Date(), { 
              hour: '2-digit', 
              minute: '2-digit',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <IconRefresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <IconPlus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      {stats && (
        <MetricsGrid stats={stats} isLoading={statsLoading} />
      )}

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts */}
        <div className="space-y-8">
          {stats && (
            <>
              <OrderStatusChart stats={stats} isLoading={statsLoading} />
              <OrderTypeChart stats={stats} isLoading={statsLoading} />
            </>
          )}
        </div>

        {/* Recent Orders */}
        <div className="space-y-8">
          <RecentOrders orders={recentOrders} isLoading={ordersLoading} />
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <IconPlus className="h-6 w-6" />
              <span className="text-sm">Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <IconPlus className="h-6 w-6" />
              <span className="text-sm">Add Driver</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Today's Deliveries
          </h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats?.statusStats.find(s => s._id === 'in-transit')?.count || 0}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Currently in transit
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-lg border">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            Completed Today
          </h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {stats?.statusStats.find(s => s._id === 'completed')?.count || 0}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Successfully delivered
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-6 rounded-lg border">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
            Urgent Orders
          </h3>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {stats?.typeStats.find(s => s._id === 'URGENT')?.count || 0}
          </p>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Require immediate attention
          </p>
        </div>
      </div>
    </div>
  )
}

