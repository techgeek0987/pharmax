import { useState, useMemo } from 'react'
import { type Product } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconPlus, IconSearch, IconMedicalCross, IconAlertTriangle } from '@tabler/icons-react'

// Dummy data
const dummyProducts = [
  {
    _id: '1',
    name: 'Aspirin 100mg',
    description: 'Pain relief and anti-inflammatory medication for daily use',
    sku: 'SKU001234',
    category: 'over-the-counter',
    price: {
      cost: 5.50,
      selling: 12.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 150,
      minStock: 50,
      maxStock: 500
    },
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic medication for bacterial infections',
    sku: 'SKU002345',
    category: 'prescription',
    price: {
      cost: 8.75,
      selling: 24.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 25,
      minStock: 30,
      maxStock: 200
    },
    status: 'active',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Digital Thermometer',
    description: 'Accurate digital thermometer for temperature monitoring',
    sku: 'SKU003456',
    category: 'medical-device',
    price: {
      cost: 15.00,
      selling: 29.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 0,
      minStock: 10,
      maxStock: 100
    },
    status: 'out-of-stock',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Vitamin D3 1000IU',
    description: 'Essential vitamin D supplement for bone health',
    sku: 'SKU004567',
    category: 'supplement',
    price: {
      cost: 6.25,
      selling: 15.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 200,
      minStock: 75,
      maxStock: 400
    },
    status: 'active',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    name: 'Ibuprofen 200mg',
    description: 'Anti-inflammatory pain reliever for various conditions',
    sku: 'SKU005678',
    category: 'over-the-counter',
    price: {
      cost: 4.50,
      selling: 11.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 8,
      minStock: 40,
      maxStock: 300
    },
    status: 'active',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    name: 'Hand Sanitizer 500ml',
    description: 'Alcohol-based hand sanitizer for infection prevention',
    sku: 'SKU006789',
    category: 'personal-care',
    price: {
      cost: 3.75,
      selling: 8.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 300,
      minStock: 100,
      maxStock: 600
    },
    status: 'active',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '7',
    name: 'Insulin Pen (Discontinued)',
    description: 'Legacy insulin delivery device - no longer available',
    sku: 'SKU007890',
    category: 'medical-device',
    price: {
      cost: 45.00,
      selling: 89.99,
      currency: 'USD'
    },
    inventory: {
      quantity: 5,
      minStock: 0,
      maxStock: 0
    },
    status: 'discontinued',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return dummyProducts.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchTerm, statusFilter, categoryFilter])

  const products = filteredProducts

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'discontinued':
        return 'outline'
      case 'out-of-stock':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prescription':
        return 'default'
      case 'over-the-counter':
        return 'secondary'
      case 'medical-device':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const isLowStock = (product: any) => {
    return product.inventory.quantity <= product.inventory.minStock
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="over-the-counter">Over-the-Counter</SelectItem>
            <SelectItem value="medical-device">Medical Device</SelectItem>
            <SelectItem value="supplement">Supplement</SelectItem>
            <SelectItem value="personal-care">Personal Care</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <IconMedicalCross className="mr-2 h-5 w-5" />
                    {product.name}
                  </CardTitle>
                  <CardDescription>SKU: {product.sku}</CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getStatusColor(product.status)}>
                    {product.status.replace('-', ' ')}
                  </Badge>
                  {isLowStock(product) && (
                    <Badge variant="destructive" className="text-xs">
                      <IconAlertTriangle className="mr-1 h-3 w-3" />
                      Low Stock
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant={getCategoryColor(product.category)} className="mb-2">
                    {product.category.replace('-', ' ')}
                  </Badge>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Price</div>
                    <div className="font-semibold">
                      ${product.price.selling.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Cost: ${product.price.cost.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Stock</div>
                    <div className="font-semibold">
                      {product.inventory.quantity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Min: {product.inventory.minStock}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-xs text-muted-foreground">
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <IconMedicalCross className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}