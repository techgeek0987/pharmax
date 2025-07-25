import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"
import { 
  ORDER_STATUSES, 
  DRIVER_STATUSES, 
  PRODUCT_STATUSES, 
  INVOICE_STATUSES,
  PAYMENT_STATUSES,
  STOCK_STATUSES,
  ORDER_TYPES,
  PRIORITY_LEVELS
} from "@/constants"

interface StatusBadgeProps {
  status: string
  type?: 'order' | 'driver' | 'product' | 'invoice' | 'payment' | 'stock' | 'orderType' | 'priority'
  className?: string
}

export function StatusBadge({ status, type = 'order', className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (type) {
      case 'order':
        return ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]
      case 'driver':
        return DRIVER_STATUSES[status as keyof typeof DRIVER_STATUSES]
      case 'product':
        return PRODUCT_STATUSES[status as keyof typeof PRODUCT_STATUSES]
      case 'invoice':
        return INVOICE_STATUSES[status as keyof typeof INVOICE_STATUSES]
      case 'payment':
        return PAYMENT_STATUSES[status as keyof typeof PAYMENT_STATUSES]
      case 'stock':
        return STOCK_STATUSES[status as keyof typeof STOCK_STATUSES]
      case 'orderType':
        return ORDER_TYPES[status as keyof typeof ORDER_TYPES]
      case 'priority':
        return PRIORITY_LEVELS[status as keyof typeof PRIORITY_LEVELS]
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const config = getStatusConfig()
  
  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(config.color, "font-medium", className)}
    >
      {type === 'orderType' && 'icon' in config && (
        <span className="mr-1">{config.icon}</span>
      )}
      {config.label}
    </Badge>
  )
}