import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { 
  Order, 
  Vehicle, 
  Driver, 
  Product, 
  Invoice, 
  DashboardStats,
  ApiResponse,
  FilterOptions
} from '@/types'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens (if needed)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      // Redirect to login if needed
    }
    return Promise.reject(error)
  }
)

// API functions
export const ordersApi = {
  getAll: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Order[]>>> => 
    api.get('/orders', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> => 
    api.get(`/orders/${id}`),
  
  create: (data: Partial<Order>): Promise<AxiosResponse<ApiResponse<Order>>> => 
    api.post('/orders', data),
  
  update: (id: string, data: Partial<Order>): Promise<AxiosResponse<ApiResponse<Order>>> => 
    api.put(`/orders/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/orders/${id}`),
  
  getStats: (): Promise<AxiosResponse<ApiResponse<DashboardStats>>> => 
    api.get('/orders/stats/dashboard'),
  
  assign: (id: string, vehicleId: string, driverId: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.post(`/orders/${id}/assign`, { vehicleId, driverId }),
  
  getByStatus: (status: string, params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Order[]>>> => 
    api.get(`/orders/status/${status}`, { params }),
}

export const vehiclesApi = {
  getAll: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Vehicle[]>>> => 
    api.get('/vehicles', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Vehicle>>> => 
    api.get(`/vehicles/${id}`),
  
  create: (data: Partial<Vehicle>): Promise<AxiosResponse<ApiResponse<Vehicle>>> => 
    api.post('/vehicles', data),
  
  update: (id: string, data: Partial<Vehicle>): Promise<AxiosResponse<ApiResponse<Vehicle>>> => 
    api.put(`/vehicles/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/vehicles/${id}`),
  
  getAvailable: (): Promise<AxiosResponse<ApiResponse<Vehicle[]>>> => 
    api.get('/vehicles/available'),
}

export const driversApi = {
  getAll: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Driver[]>>> => 
    api.get('/drivers', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Driver>>> => 
    api.get(`/drivers/${id}`),
  
  create: (data: Partial<Driver>): Promise<AxiosResponse<ApiResponse<Driver>>> => 
    api.post('/drivers', data),
  
  update: (id: string, data: Partial<Driver>): Promise<AxiosResponse<ApiResponse<Driver>>> => 
    api.put(`/drivers/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/drivers/${id}`),
  
  getAvailable: (): Promise<AxiosResponse<ApiResponse<Driver[]>>> => 
    api.get('/drivers/available'),
}

export const productsApi = {
  getAll: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Product[]>>> => 
    api.get('/products', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Product>>> => 
    api.get(`/products/${id}`),
  
  create: (data: Partial<Product>): Promise<AxiosResponse<ApiResponse<Product>>> => 
    api.post('/products', data),
  
  update: (id: string, data: Partial<Product>): Promise<AxiosResponse<ApiResponse<Product>>> => 
    api.put(`/products/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/products/${id}`),
}

export const invoicesApi = {
  getAll: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Invoice[]>>> => 
    api.get('/invoices', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Invoice>>> => 
    api.get(`/invoices/${id}`),
  
  create: (data: Partial<Invoice>): Promise<AxiosResponse<ApiResponse<Invoice>>> => 
    api.post('/invoices', data),
  
  update: (id: string, data: Partial<Invoice>): Promise<AxiosResponse<ApiResponse<Invoice>>> => 
    api.put(`/invoices/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/invoices/${id}`),
  
  getPending: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Invoice[]>>> => 
    api.get('/invoices', { params: { ...params, status: 'pending' } }),
  
  getOverdue: (params?: FilterOptions): Promise<AxiosResponse<ApiResponse<Invoice[]>>> => 
    api.get('/invoices', { params: { ...params, status: 'overdue' } }),
}

export default api