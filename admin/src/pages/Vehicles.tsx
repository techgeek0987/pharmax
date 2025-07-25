import { useState, useMemo } from 'react'
import { type Vehicle } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconPlus, IconSearch, IconTruck, IconMapPin } from '@tabler/icons-react'

// Dummy data
const dummyVehicles = [
  {
    _id: '1',
    id: 'VH-001',
    type: 'Medium-Duty Box Truck',
    maxWeight: '3200 kg',
    dimensions: '15-20 m³',
    tags: ['HEAVY LOAD', 'GPS'],
    available: true,
    currentLocation: 'Downtown Hub',
    assignedOrders: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    id: 'VH-002',
    type: 'Light Commercial Vehicle',
    maxWeight: '1500 kg',
    dimensions: '8-12 m³',
    tags: ['EXPRESS', 'GPS'],
    available: false,
    currentLocation: 'North Station',
    assignedOrders: ['order1'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    id: 'VH-003',
    type: 'Refrigerated Van',
    maxWeight: '2000 kg',
    dimensions: '10-15 m³',
    tags: ['REFRIGERATED', 'TEMPERATURE CONTROLLED', 'GPS'],
    available: true,
    currentLocation: 'Central Depot',
    assignedOrders: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    id: 'VH-004',
    type: 'Heavy-Duty Truck',
    maxWeight: '5000 kg',
    dimensions: '25-30 m³',
    tags: ['HEAVY LOAD', 'CRANE', 'GPS'],
    available: true,
    currentLocation: 'South Warehouse',
    assignedOrders: [],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    id: 'VH-005',
    type: 'Express Delivery Van',
    maxWeight: '1000 kg',
    dimensions: '5-8 m³',
    tags: ['EXPRESS', 'FAST DELIVERY', 'GPS'],
    available: false,
    currentLocation: 'East Terminal',
    assignedOrders: ['order2', 'order3'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    id: 'VH-006',
    type: 'Cargo Van',
    maxWeight: '1800 kg',
    dimensions: '12-15 m³',
    tags: ['STANDARD', 'GPS'],
    available: true,
    currentLocation: 'West Hub',
    assignedOrders: [],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Filter vehicles based on search and filters
  const filteredVehicles = useMemo(() => {
    return dummyVehicles.filter(vehicle => {
      const matchesSearch = searchTerm === '' || 
        vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && vehicle.available) ||
        (availabilityFilter === 'unavailable' && !vehicle.available)
      
      const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
      
      return matchesSearch && matchesAvailability && matchesType
    })
  }, [searchTerm, availabilityFilter, typeFilter])

  const vehicles = filteredVehicles

  const getAvailabilityColor = (available: boolean) => {
    return available ? 'default' : 'secondary'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Light Commercial Vehicle">Light Commercial</SelectItem>
            <SelectItem value="Medium-Duty Box Truck">Medium-Duty Box</SelectItem>
            <SelectItem value="Heavy-Duty Truck">Heavy-Duty</SelectItem>
            <SelectItem value="Refrigerated Van">Refrigerated</SelectItem>
            <SelectItem value="Express Delivery Van">Express Delivery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <IconTruck className="mr-2 h-5 w-5" />
                    {vehicle.id}
                  </CardTitle>
                  <CardDescription>{vehicle.type}</CardDescription>
                </div>
                <Badge variant={getAvailabilityColor(vehicle.available)}>
                  {vehicle.available ? 'Available' : 'In Use'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Max Weight</div>
                    <div className="font-semibold">{vehicle.maxWeight}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Dimensions</div>
                    <div className="font-semibold">{vehicle.dimensions}</div>
                  </div>
                </div>

                {vehicle.currentLocation && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <IconMapPin className="mr-1 h-4 w-4" />
                      Current Location
                    </div>
                    <div className="text-sm">{vehicle.currentLocation}</div>
                  </div>
                )}

                {vehicle.tags && vehicle.tags.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Features</div>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div className="text-xs text-muted-foreground">
                    Added: {new Date(vehicle.createdAt).toLocaleDateString()}
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

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <IconTruck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No vehicles found</h3>
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