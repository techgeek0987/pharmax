import { useState, useMemo } from 'react'
import { type Driver } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconPlus, IconSearch, IconUser, IconMapPin, IconPhone, IconMail } from '@tabler/icons-react'

// Dummy data
const dummyDrivers = [
  {
    _id: '1',
    id: 'DR-001',
    name: 'Jake Foster',
    email: 'jake.foster@pharmx.com',
    phone: '+1-555-0101',
    image: '/avatars/jake.jpg',
    status: 'available' as const,
    currentLocation: 'Downtown Hub',
    assignedVehicle: 'VH-001',
    assignedOrders: [],
    licenseNumber: 'DL123456789',
    licenseExpiry: '2025-12-31',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    id: 'DR-002',
    name: 'Lory Kim',
    email: 'lory.kim@pharmx.com',
    phone: '+1-555-0102',
    image: '/avatars/lory.jpg',
    status: 'busy' as const,
    currentLocation: 'North Station',
    assignedVehicle: 'VH-002',
    assignedOrders: ['order1'],
    licenseNumber: 'DL987654321',
    licenseExpiry: '2026-06-15',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    id: 'DR-003',
    name: 'Darren Anderson',
    email: 'darren.anderson@pharmx.com',
    phone: '+1-555-0103',
    image: '/avatars/darren.jpg',
    status: 'available' as const,
    currentLocation: 'Central Depot',
    assignedVehicle: null,
    assignedOrders: [],
    licenseNumber: 'DL456789123',
    licenseExpiry: '2025-09-20',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    id: 'DR-004',
    name: 'Sarah Martinez',
    email: 'sarah.martinez@pharmx.com',
    phone: '+1-555-0104',
    image: '/avatars/sarah.jpg',
    status: 'offline' as const,
    currentLocation: 'South Warehouse',
    assignedVehicle: null,
    assignedOrders: [],
    licenseNumber: 'DL789123456',
    licenseExpiry: '2026-03-10',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    id: 'DR-005',
    name: 'Mike Johnson',
    email: 'mike.johnson@pharmx.com',
    phone: '+1-555-0105',
    image: '/avatars/mike.jpg',
    status: 'busy' as const,
    currentLocation: 'East Terminal',
    assignedVehicle: 'VH-005',
    assignedOrders: ['order2', 'order3'],
    licenseNumber: 'DL321654987',
    licenseExpiry: '2025-11-05',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    id: 'DR-006',
    name: 'Lisa Chen',
    email: 'lisa.chen@pharmx.com',
    phone: '+1-555-0106',
    image: '/avatars/lisa.jpg',
    status: 'available' as const,
    currentLocation: 'West Hub',
    assignedVehicle: null,
    assignedOrders: [],
    licenseNumber: 'DL654987321',
    licenseExpiry: '2026-08-18',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function Drivers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter drivers based on search and filters
  const filteredDrivers = useMemo(() => {
    return dummyDrivers.filter(driver => {
      const matchesSearch = searchTerm === '' || 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const drivers = filteredDrivers

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'default'
      case 'busy':
        return 'secondary'
      case 'offline':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Drivers</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
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
            <SelectItem value="all">All Drivers</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <Card key={driver._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={driver.image} alt={driver.name} />
                    <AvatarFallback>{getInitials(driver.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <CardDescription>ID: {driver.id}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusColor(driver.status)}>
                  {driver.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  {driver.email && (
                    <div className="flex items-center text-sm">
                      <IconMail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{driver.email}</span>
                    </div>
                  )}
                  {driver.phone && (
                    <div className="flex items-center text-sm">
                      <IconPhone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{driver.phone}</span>
                    </div>
                  )}
                  {driver.currentLocation && (
                    <div className="flex items-center text-sm">
                      <IconMapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{driver.currentLocation}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">License Number</div>
                    <div className="text-sm font-mono">{driver.licenseNumber}</div>
                  </div>
                  {driver.licenseExpiry && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">License Expiry</div>
                      <div className="text-sm">
                        {new Date(driver.licenseExpiry).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-xs text-muted-foreground">
                    Joined: {new Date(driver.createdAt).toLocaleDateString()}
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

      {drivers.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <IconUser className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No drivers found</h3>
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