import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  variant = 'default'
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend?.type) {
      case 'increase':
        return <IconTrendingUp className="h-3 w-3" />
      case 'decrease':
        return <IconTrendingDown className="h-3 w-3" />
      default:
        return <IconMinus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    switch (trend?.type) {
      case 'increase':
        return 'text-green-600 bg-green-50'
      case 'decrease':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50'
      case 'error':
        return 'border-red-200 bg-red-50/50'
      default:
        return ''
    }
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          {description && (
            <p className="text-xs text-muted-foreground flex-1">
              {description}
            </p>
          )}
          {trend && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                getTrendColor()
              )}
            >
              {getTrendIcon()}
              {trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}