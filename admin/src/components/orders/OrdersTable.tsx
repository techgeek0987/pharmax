import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Order } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  IconEye, 
  IconEdit, 
  IconTrash, 
  IconTruck,
  IconMapPin,
  IconPackage,
  IconClock,
  IconUser,
  IconCalendar
} from "@tabler/icons-react"
import { formatDate, formatCurrency, getInitials } from "@/utils"
import { ORDER_STATUSES, ORDER_TYPES } from "@/constants"

interface OrdersTableProps {
  orders: Order[]
  isLoading?: boolean
  onView?: (order: Order) => void
  onEdit?: (order: Order) => void
  onDelete?: (order: Order) => void
  onAssign?: (order: Order) => void
  onStatusChange?: (order: Order, status: string) => void
  onExport?: (data: Order[]) => void
  onRefresh?: () => void
}

export function OrdersTable({ 
  orders, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete, 
  onAssign,
  onStatusChange,
  onExport,
  onRefresh
}: OrdersTableProps) {
  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order ID" />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getInitials(order.customer?.name || order.id)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{order.id}</div>
              {order.customer?.name && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <IconUser className="h-3 w-3" />
                  {order.customer.name}
                </div>
              )}
            </div>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconMapPin className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-32 truncate">{row.getValue("location")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("type")} type="orderType" />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("status")} type="order" />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "packages",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Packages" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconPackage className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("packages")}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const amount = row.getValue("totalAmount") as number
        return amount ? formatCurrency(amount) : "-"
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(row.getValue("createdAt"))}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original
        
        const actions = [
          {
            label: "View details",
            onClick: (order: Order) => onView?.(order),
            icon: <IconEye className="h-4 w-4" />,
          },
          {
            label: "Edit order",
            onClick: (order: Order) => onEdit?.(order),
            icon: <IconEdit className="h-4 w-4" />,
          },
          ...(order.status === 'open' ? [{
            label: "Assign driver",
            onClick: (order: Order) => onAssign?.(order),
            icon: <IconTruck className="h-4 w-4" />,
          }] : []),
          {
            label: "Delete",
            onClick: (order: Order) => onDelete?.(order),
            icon: <IconTrash className="h-4 w-4" />,
            variant: 'destructive' as const,
          },
        ]

        const statusActions = onStatusChange ? {
          label: "Change status",
          statuses: Object.entries(ORDER_STATUSES).map(([value, config]) => ({
            label: config.label,
            value,
          })),
          onStatusChange: (order: Order, status: string) => onStatusChange(order, status),
        } : undefined

        return (
          <DataTableRowActions
            row={row}
            actions={actions}
            statusActions={statusActions}
          />
        )
      },
    },
  ]

  // Filter options for the faceted filters
  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: Object.entries(ORDER_STATUSES).map(([value, config]) => ({
        label: config.label,
        value,
      })),
    },
    {
      id: "type",
      title: "Type",
      options: Object.entries(ORDER_TYPES).map(([value, config]) => ({
        label: config.label,
        value,
        icon: () => <span>{config.icon}</span>,
      })),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={orders}
      searchKey="id"
      searchPlaceholder="Search orders by ID, customer, or location..."
      filterableColumns={filterableColumns}
      viewOptions={{
        enableHiding: true,
        enableSelection: true,
      }}
      toolbar={{
        enableSearch: true,
        enableFilters: true,
        enableViewOptions: true,
        enableExport: true,
        customActions: onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <IconClock className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        ),
      }}
      onExport={onExport}
    />
  )
}