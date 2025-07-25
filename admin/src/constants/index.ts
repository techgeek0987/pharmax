// Order constants
export const ORDER_STATUSES = {
  'to-be-fulfilled': { label: 'To Be Fulfilled', color: 'bg-gray-100 text-gray-800' },
  'open': { label: 'Open', color: 'bg-blue-100 text-blue-800' },
  'ready': { label: 'Ready', color: 'bg-yellow-100 text-yellow-800' },
  'assigned': { label: 'Assigned', color: 'bg-purple-100 text-purple-800' },
  'in-transit': { label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
  'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  'returned': { label: 'Returned', color: 'bg-orange-100 text-orange-800' }
} as const

export const ORDER_TYPES = {
  'EXPRESS': { label: 'Express', color: 'bg-red-100 text-red-800', icon: '⚡' },
  'REFRIGERATED': { label: 'Refrigerated', color: 'bg-blue-100 text-blue-800', icon: '❄️' },
  'HEAVY': { label: 'Heavy', color: 'bg-orange-100 text-orange-800', icon: '📦' },
  'LATE PICKUP': { label: 'Late Pickup', color: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
  'STANDARD': { label: 'Standard', color: 'bg-gray-100 text-gray-800', icon: '📋' },
  'URGENT': { label: 'Urgent', color: 'bg-red-100 text-red-800', icon: '🚨' }
} as const

export const PRIORITY_LEVELS = {
  'low': { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
  'urgent': { label: 'Urgent', color: 'bg-red-100 text-red-800' }
} as const

// Driver constants
export const DRIVER_STATUSES = {
  'available': { label: 'Available', color: 'bg-green-100 text-green-800' },
  'busy': { label: 'Busy', color: 'bg-yellow-100 text-yellow-800' },
  'offline': { label: 'Offline', color: 'bg-gray-100 text-gray-800' }
} as const

// Product constants
export const PRODUCT_STATUSES = {
  'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
  'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  'discontinued': { label: 'Discontinued', color: 'bg-red-100 text-red-800' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-orange-100 text-orange-800' }
} as const

export const STOCK_STATUSES = {
  'in-stock': { label: 'In Stock', color: 'bg-green-100 text-green-800' },
  'low-stock': { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  'overstock': { label: 'Overstock', color: 'bg-blue-100 text-blue-800' }
} as const

// Invoice constants
export const INVOICE_STATUSES = {
  'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  'sent': { label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  'viewed': { label: 'Viewed', color: 'bg-purple-100 text-purple-800' },
  'paid': { label: 'Paid', color: 'bg-green-100 text-green-800' },
  'overdue': { label: 'Overdue', color: 'bg-red-100 text-red-800' },
  'cancelled': { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  'refunded': { label: 'Refunded', color: 'bg-orange-100 text-orange-800' }
} as const

export const PAYMENT_STATUSES = {
  'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'partial': { label: 'Partial', color: 'bg-orange-100 text-orange-800' },
  'paid': { label: 'Paid', color: 'bg-green-100 text-green-800' },
  'failed': { label: 'Failed', color: 'bg-red-100 text-red-800' },
  'refunded': { label: 'Refunded', color: 'bg-purple-100 text-purple-800' }
} as const

// Chart colors for consistent theming
export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
} as const

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
} as const