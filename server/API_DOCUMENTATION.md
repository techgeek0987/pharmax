# PharmX Dashboard API Documentation

## Overview
This API provides endpoints for managing orders, vehicles, and drivers in the PharmX dashboard system.

## Base URL
```
http://localhost:5000/api
```

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... } // Optional validation errors
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

## Orders API

### GET /api/orders
Get all orders with optional filtering, searching, sorting, and pagination.

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `sort` (string): Sort field(s), comma-separated (e.g., "-createdAt,status")
- `fields` (string): Fields to include, comma-separated
- `search` (string): Search term (searches id, location, type, assignee, status)
- `status` (string): Filter by status
- `type` (string): Filter by type
- `assignee` (string): Filter by assignee

**Example:**
```
GET /api/orders?page=1&limit=10&status=open&search=wells
```

### GET /api/orders/:id
Get a single order by ID.

### POST /api/orders
Create a new order.

**Request Body:**
```json
{
  "id": "#ORD001",
  "location": "Downtown Pharmacy",
  "time": "14:30",
  "packages": 25,
  "type": "EXPRESS",
  "status": "to-be-fulfilled"
}
```

### PUT /api/orders/:id
Update an existing order.

### DELETE /api/orders/:id
Delete an order.

### POST /api/orders/:id/assign
Assign vehicle and driver to an order.

**Request Body:**
```json
{
  "vehicleId": "VH-001",
  "driverId": "DR-001"
}
```

### GET /api/orders/status/:status
Get orders by status (to-be-fulfilled, open, ready, completed, cancelled).

### GET /api/orders/stats/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "totalOrders": 150,
  "statusStats": [
    { "_id": "open", "count": 45 },
    { "_id": "ready", "count": 30 }
  ],
  "typeStats": [
    { "_id": "EXPRESS", "count": 60 },
    { "_id": "HEAVY", "count": 40 }
  ]
}
```

### GET /api/orders/filter
Get orders with advanced filtering.

**Query Parameters:**
- `status` (string): Filter by status
- `type` (string): Filter by type
- `assignee` (string): Filter by assignee
- `location` (string): Filter by location (partial match)

## Vehicles API

### GET /api/vehicles
Get all vehicles with optional filtering, searching, sorting, and pagination.

**Query Parameters:**
- Same as orders API plus:
- `available` (boolean): Filter by availability
- `type` (string): Filter by vehicle type

### GET /api/vehicles/:id
Get a single vehicle by ID.

### POST /api/vehicles
Create a new vehicle.

**Request Body:**
```json
{
  "id": "VH-001",
  "type": "Medium-Duty Box Truck",
  "maxWeight": "3200 kg",
  "dimensions": "15-20 m³",
  "tags": ["HEAVY LOAD", "GPS"],
  "available": true
}
```

### PUT /api/vehicles/:id
Update an existing vehicle.

### DELETE /api/vehicles/:id
Delete a vehicle.

### GET /api/vehicles/available
Get all available vehicles.

### GET /api/vehicles/type/:type
Get vehicles by type.

### POST /api/vehicles/:id/assign
Assign an order to a vehicle.

**Request Body:**
```json
{
  "orderId": "ORDER_OBJECT_ID"
}
```

### POST /api/vehicles/:id/unassign
Unassign an order from a vehicle.

### PATCH /api/vehicles/:id/availability
Update vehicle availability.

**Request Body:**
```json
{
  "available": false
}
```

### GET /api/vehicles/filter
Get vehicles with advanced filtering.

## Drivers API

### GET /api/drivers
Get all drivers with optional filtering, searching, sorting, and pagination.

**Query Parameters:**
- Same as orders API plus:
- `status` (string): Filter by status (available, busy, offline)
- `available` (boolean): Filter by availability

### GET /api/drivers/:id
Get a single driver by ID.

### POST /api/drivers
Create a new driver.

**Request Body:**
```json
{
  "id": "DR-001",
  "name": "John Doe",
  "email": "john.doe@pharmx.com",
  "phone": "+1234567890",
  "status": "available",
  "currentLocation": "Downtown Hub",
  "licenseNumber": "DL123456789",
  "licenseExpiry": "2025-12-31"
}
```

### PUT /api/drivers/:id
Update an existing driver.

### DELETE /api/drivers/:id
Delete a driver.

### GET /api/drivers/available
Get all available drivers.

### GET /api/drivers/status/:status
Get drivers by status.

### POST /api/drivers/:id/assign-vehicle
Assign a vehicle to a driver.

**Request Body:**
```json
{
  "vehicleId": "VEHICLE_OBJECT_ID"
}
```

### POST /api/drivers/:id/assign-order
Assign an order to a driver.

**Request Body:**
```json
{
  "orderId": "ORDER_OBJECT_ID"
}
```

### POST /api/drivers/:id/unassign-order
Unassign an order from a driver.

### PATCH /api/drivers/:id/status
Update driver status.

**Request Body:**
```json
{
  "status": "busy"
}
```

### PATCH /api/drivers/:id/location
Update driver location.

**Request Body:**
```json
{
  "location": "North Station"
}
```

### GET /api/drivers/stats
Get driver statistics.

### GET /api/drivers/filter
Get drivers with advanced filtering.

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, duplicate IDs)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### Order
```json
{
  "id": "string (unique)",
  "location": "string",
  "time": "string (optional)",
  "packages": "number",
  "type": "EXPRESS | REFRIGERATED | HEAVY | LATE PICKUP",
  "assignee": "string (optional)",
  "status": "to-be-fulfilled | open | ready | completed | cancelled",
  "secondType": "string (optional)",
  "image": "string (optional)",
  "duration": "string (optional)",
  "assignShelf": "boolean",
  "weight": "string (optional)",
  "code": "string (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Vehicle
```json
{
  "id": "string (unique)",
  "type": "string",
  "maxWeight": "string",
  "dimensions": "string",
  "tags": ["string"],
  "available": "boolean",
  "currentLocation": "string (optional)",
  "assignedOrders": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Driver
```json
{
  "id": "string (unique)",
  "name": "string",
  "email": "string (unique)",
  "phone": "string (optional)",
  "image": "string (optional)",
  "status": "available | busy | offline",
  "currentLocation": "string (optional)",
  "assignedVehicle": "ObjectId (optional)",
  "assignedOrders": ["ObjectId"],
  "licenseNumber": "string",
  "licenseExpiry": "Date (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Usage Examples

### Get paginated orders
```bash
curl "http://localhost:5000/api/orders?page=1&limit=5&sort=-createdAt"
```

### Create a new order
```bash
curl -X POST "http://localhost:5000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "#NEW001",
    "location": "Central Pharmacy",
    "packages": 15,
    "type": "EXPRESS",
    "status": "to-be-fulfilled"
  }'
```

### Assign vehicle and driver to order
```bash
curl -X POST "http://localhost:5000/api/orders/NEW001/assign" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "BA-02-AS",
    "driverId": "1"
  }'
```

### Get dashboard statistics
```bash
curl "http://localhost:5000/api/orders/stats/dashboard"
```