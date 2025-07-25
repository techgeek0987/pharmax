// Core entity types based on server models
export interface Order {
  _id: string
  id: string
  orderNumber?: string
  customer?: {
    id?: string
    name?: string
    email?: string
    phone?: string
    address?: Address
  }
  location: string
  deliveryAddress?: Address & {
    coordinates?: {
      lat: number
      lng: number
    }
  }
  time?: string
  scheduledDelivery?: {
    date: Date
    timeSlot: string
    instructions?: string
  }
  items?: OrderItem[]
  packages: number
  type: 'EXPRESS' | 'REFRIGERATED' | 'HEAVY' | 'LATE PICKUP' | 'STANDARD' | 'URGENT'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  assignedDriver?: string
  assignedVehicle?: string
  status: 'to-be-fulfilled' | 'open' | 'ready' | 'assigned' | 'in-transit' | 'delivered' | 'completed' | 'cancelled' | 'returned'
  secondType?: string
  image?: string
  duration?: string
  estimatedDuration?: number
  actualDuration?: number
  assignShelf?: boolean
  weight?: string
  dimensions?: Dimensions
  code?: string
  trackingNumber?: string
  prescription?: {
    required: boolean
    prescriptionId?: string
    doctorName?: string
    patientName?: string
  }
  specialInstructions?: string
  deliveryNotes?: string
  totalAmount?: number
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  statusHistory?: StatusHistoryItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  product?: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Vehicle {
  _id: string
  id: string
  type: string
  maxWeight: string
  dimensions: string
  tags: string[]
  available: boolean
  currentLocation?: string
  assignedOrders: string[]
  createdAt: string
  updatedAt: string
}

export interface Driver {
  _id: string
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  status: 'available' | 'busy' | 'offline'
  currentLocation?: string
  assignedVehicle?: string
  assignedOrders: string[]
  licenseNumber: string
  licenseExpiry?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  _id: string
  name: string
  description?: string
  sku: string
  barcode?: string
  category: string
  subcategory?: string
  brand?: string
  manufacturer?: string
  price: {
    cost: number
    selling: number
    currency: string
  }
  inventory: {
    quantity: number
    minStock: number
    maxStock: number
    reorderPoint: number
    location?: {
      warehouse?: string
      shelf?: string
      bin?: string
    }
  }
  specifications?: {
    weight?: {
      value: number
      unit: string
    }
    dimensions?: Dimensions
    color?: string
    size?: string
    material?: string
  }
  images?: ProductImage[]
  status: 'active' | 'inactive' | 'discontinued' | 'out-of-stock'
  tags: string[]
  supplier?: {
    name?: string
    contact?: string
    email?: string
    phone?: string
  }
  prescriptionRequired: boolean
  expiryDate?: string
  batchNumber?: string
  regulatoryInfo?: {
    fdaApproved: boolean
    controlledSubstance: boolean
    schedule?: string
  }
  createdAt: string
  updatedAt: string
  profitMargin?: number
  stockStatus?: 'out-of-stock' | 'low-stock' | 'in-stock' | 'overstock'
}

export interface ProductImage {
  url: string
  alt?: string
  isPrimary: boolean
}

export interface Invoice {
  _id: string
  invoiceNumber: string
  customer: {
    name: string
    email?: string
    phone?: string
    address?: Address
    taxId?: string
  }
  items: InvoiceItem[]
  subtotal: number
  totalDiscount: number
  totalTax: number
  shippingCost: number
  totalAmount: number
  currency: string
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'partial' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  paymentDetails: {
    transactionId?: string
    paymentDate?: string
    paidAmount: number
    remainingAmount: number
  }
  dates: {
    issueDate: string
    dueDate: string
    paidDate?: string
    sentDate?: string
  }
  terms?: {
    paymentTerms: string
    notes?: string
    termsAndConditions?: string
  }
  relatedOrder?: string
  daysOverdue?: number
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  product?: string
  productDetails: {
    name: string
    sku: string
    description?: string
  }
  quantity: number
  unitPrice: number
  discount: number
  discountType: 'percentage' | 'fixed'
  taxRate: number
  lineTotal: number
}

// Common types
export interface Address {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface Dimensions {
  length?: number
  width?: number
  height?: number
  unit?: string
}

export interface StatusHistoryItem {
  status: string
  timestamp: string
  updatedBy?: string
  notes?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage?: number
    prevPage?: number
  }
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number
  statusStats: Array<{ _id: string; count: number }>
  typeStats: Array<{ _id: string; count: number }>
}

// Filter and search types
export interface FilterOptions {
  page?: number
  limit?: number
  sort?: string
  search?: string
  status?: string
  type?: string
  assignee?: string
  available?: boolean
}