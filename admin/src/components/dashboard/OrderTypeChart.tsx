import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { DashboardStats } from "@/types"
import { ORDER_TYPES } from "@/constants"

interface OrderTypeChartProps {
  stats: DashboardStats
  isLoading?: boolean
}

export function OrderTypeChart({ stats, isLoading }: OrderTypeChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-end space-x-2">
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                  <div className="h-12 bg-gray-200 rounded flex-1" />
                  <div className="h-6 bg-gray-200 rounded flex-1" />
                  <div className="h-16 bg-gray-200 rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = stats.typeStats.map((stat) => ({
    name: ORDER_TYPES[stat._id as keyof typeof ORDER_TYPES]?.label || stat._id,
    value: stat.count,
    icon: ORDER_TYPES[stat._id as keyof typeof ORDER_TYPES]?.icon || '📦'
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium flex items-center gap-2">
            <span>{chartData.find(d => d.name === label)?.icon}</span>
            {label}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.value} orders ({((data.value / stats.totalOrders) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}