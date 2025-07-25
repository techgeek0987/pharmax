import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/common/StatusBadge"
import { formatDate, formatCurrency, getInitials } from "@/utils"
import type { Order } from "@/types"
import { IconArrowRight, IconMapPin, IconClock } from "@tabler/icons-react"
import { Link } from "react-router-dom"

interface RecentOrdersProps {
  orders: Order[]
  isLoading?: boolean
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/orders" className="flex items-center gap-2">
            View all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(order.customer?.name || order.id)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">
                    {order.customer?.name || `Order ${order.id}`}
                  </p>
                  <StatusBadge status={order.type} type="orderType" />
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconMapPin className="h-3 w-3" />
                    <span className="truncate max-w-32">{order.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconClock className="h-3 w-3" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={order.status} type="order" />
                {order.totalAmount && (
                  <span className="text-sm font-medium">
                    {formatCurrency(order.totalAmount)}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent orders found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}