import { StatsCard } from "@/components/common/StatsCard"
import { 
  IconPackage, 
  IconTruck, 
  IconUsers, 
  IconCurrencyDollar,
  IconClipboardList,
  IconMedicalCross
} from "@tabler/icons-react"
import type { DashboardStats } from "@/types"

interface MetricsGridProps {
  stats: DashboardStats
  isLoading?: boolean
}

export function MetricsGrid({ stats, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  const totalCompleted = stats.statusStats.find(s => s._id === 'completed')?.count || 0
  const totalInTransit = stats.statusStats.find(s => s._id === 'in-transit')?.count || 0
  const totalPending = stats.statusStats.find(s => s._id === 'to-be-fulfilled')?.count || 0
  
  const completionRate = stats.totalOrders > 0 ? 
    Math.round((totalCompleted / stats.totalOrders) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders.toLocaleString()}
        description="All time orders"
        icon={<IconPackage className="h-4 w-4" />}
        trend={{
          value: 12,
          label: "from last month",
          type: "increase"
        }}
      />
      
      <StatsCard
        title="Completed"
        value={totalCompleted.toLocaleString()}
        description="Successfully delivered"
        icon={<IconClipboardList className="h-4 w-4" />}
        variant="success"
        trend={{
          value: completionRate,
          label: "completion rate",
          type: "increase"
        }}
      />
      
      <StatsCard
        title="In Transit"
        value={totalInTransit.toLocaleString()}
        description="Currently being delivered"
        icon={<IconTruck className="h-4 w-4" />}
        variant="warning"
      />
      
      <StatsCard
        title="Pending"
        value={totalPending.toLocaleString()}
        description="Awaiting fulfillment"
        icon={<IconUsers className="h-4 w-4" />}
        variant={totalPending > 10 ? "error" : "default"}
      />
      
      <StatsCard
        title="Revenue"
        value="$24,500"
        description="This month"
        icon={<IconCurrencyDollar className="h-4 w-4" />}
        trend={{
          value: 8,
          label: "from last month",
          type: "increase"
        }}
      />
      
      <StatsCard
        title="Products"
        value="1,247"
        description="In inventory"
        icon={<IconMedicalCross className="h-4 w-4" />}
        trend={{
          value: 3,
          label: "low stock items",
          type: "decrease"
        }}
      />
    </div>
  )
}