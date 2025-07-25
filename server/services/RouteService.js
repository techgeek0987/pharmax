const BaseService = require('./BaseService');
const Route = require('../models/Route');
const Order = require('../models/Order');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

class RouteService extends BaseService {
  constructor() {
    const populateOptions = [
      { path: 'assignedDriver', select: 'name email phone status currentLocation' },
      { path: 'assignedVehicle', select: 'id type maxWeight dimensions available currentLocation' },
      { path: 'orders', select: 'id location packages type status totalAmount customer' }
    ];
    
    super(Route, 'Route', populateOptions);
  }

  // Custom search with route-specific fields
  async searchRoutes(queryString) {
    const searchableFields = [
      'routeId',
      'name',
      'description',
      'startLocation.address',
      'endLocation.address'
    ];
    
    return await this.search(queryString, searchableFields);
  }

  // Create optimized route
  async createOptimizedRoute(data) {
    try {
      const { driverId, vehicleId, orderIds, startLocation, priority = 'medium' } = data;

      // Validate driver
      const driver = await Driver.findById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }
      if (driver.status !== 'available') {
        throw new Error('Driver is not available');
      }

      // Validate vehicle
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      if (!vehicle.available) {
        throw new Error('Vehicle is not available');
      }

      // Validate orders
      const orders = await Order.find({ _id: { $in: orderIds }, status: 'open' });
      if (orders.length !== orderIds.length) {
        throw new Error('One or more orders not found or not available');
      }

      // Generate optimized waypoints
      const waypoints = await this.optimizeWaypoints(orders);

      // Calculate estimated duration and distance
      const { estimatedDuration, estimatedDistance } = this.calculateRouteMetrics(waypoints);

      // Create route data
      const routeData = {
        routeId: `ROUTE-${Date.now()}`,
        name: `Optimized Route - ${driver.name}`,
        description: `Optimized delivery route for ${orders.length} orders`,
        startLocation: startLocation || { address: 'Depot', coordinates: { lat: 0, lng: 0 } },
        endLocation: startLocation || { address: 'Depot', coordinates: { lat: 0, lng: 0 } },
        waypoints,
        orders: orderIds,
        assignedDriver: driverId,
        assignedVehicle: vehicleId,
        priority,
        estimatedDuration,
        estimatedDistance,
        status: 'planned',
        optimized: true
      };

      // Create route
      const route = await this.create(routeData);

      // Update related entities
      await this.updateRelatedEntities(route._id, driverId, vehicleId, orderIds);

      return route;
    } catch (error) {
      throw error;
    }
  }

  // Optimize waypoints using nearest neighbor algorithm
  async optimizeWaypoints(orders) {
    try {
      // Simple nearest neighbor optimization
      // In a real application, you'd use more sophisticated algorithms
      const waypoints = orders.map(order => ({
        orderId: order._id,
        location: {
          address: order.location,
          coordinates: order.deliveryAddress?.coordinates || { lat: 0, lng: 0 }
        },
        estimatedArrival: null,
        completed: false
      }));

      // Sort by priority and location (simplified)
      waypoints.sort((a, b) => {
        // Prioritize by order type (EXPRESS first)
        const orderA = orders.find(o => o._id.toString() === a.orderId.toString());
        const orderB = orders.find(o => o._id.toString() === b.orderId.toString());
        
        if (orderA.type === 'EXPRESS' && orderB.type !== 'EXPRESS') return -1;
        if (orderA.type !== 'EXPRESS' && orderB.type === 'EXPRESS') return 1;
        
        return 0;
      });

      return waypoints;
    } catch (error) {
      throw error;
    }
  }

  // Calculate route metrics
  calculateRouteMetrics(waypoints) {
    // Simplified calculation - in reality, you'd use mapping APIs
    const estimatedDuration = waypoints.length * 30; // 30 minutes per stop
    const estimatedDistance = waypoints.length * 5; // 5 km per stop
    
    return { estimatedDuration, estimatedDistance };
  }

  // Update related entities when route is created/updated
  async updateRelatedEntities(routeId, driverId, vehicleId, orderIds) {
    try {
      // Update driver status
      if (driverId) {
        await Driver.findByIdAndUpdate(driverId, {
          status: 'busy',
          $push: { assignedRoutes: routeId }
        });
      }

      // Update vehicle availability
      if (vehicleId) {
        await Vehicle.findByIdAndUpdate(vehicleId, {
          available: false,
          $push: { assignedRoutes: routeId }
        });
      }

      // Update orders status
      if (orderIds && orderIds.length > 0) {
        await Order.updateMany(
          { _id: { $in: orderIds } },
          { 
            status: 'assigned',
            assignedRoute: routeId,
            assignedDriver: driverId,
            assignedVehicle: vehicleId
          }
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // Start route
  async startRoute(routeId) {
    try {
      const route = await this.getById(routeId);
      if (!route) {
        throw new Error('Route not found');
      }

      if (route.status !== 'planned') {
        throw new Error('Route can only be started if it is in planned status');
      }

      // Update route status
      const updatedRoute = await this.update(routeId, {
        status: 'in-progress',
        actualStartTime: new Date()
      });

      // Update orders status
      if (route.orders && route.orders.length > 0) {
        await Order.updateMany(
          { _id: { $in: route.orders } },
          { status: 'in-transit' }
        );
      }

      return updatedRoute;
    } catch (error) {
      throw error;
    }
  }

  // Complete route
  async completeRoute(routeId, notes = '') {
    try {
      const route = await this.getById(routeId);
      if (!route) {
        throw new Error('Route not found');
      }

      if (route.status !== 'in-progress') {
        throw new Error('Route can only be completed if it is in progress');
      }

      const actualEndTime = new Date();
      const actualDuration = route.actualStartTime ? 
        Math.round((actualEndTime - route.actualStartTime) / (1000 * 60)) : null;

      // Update route status
      const updatedRoute = await this.update(routeId, {
        status: 'completed',
        actualEndTime,
        actualDuration,
        notes: notes || route.notes
      });

      // Free up driver and vehicle
      if (route.assignedDriver) {
        await Driver.findByIdAndUpdate(route.assignedDriver, {
          status: 'available',
          $pull: { assignedRoutes: routeId }
        });
      }

      if (route.assignedVehicle) {
        await Vehicle.findByIdAndUpdate(route.assignedVehicle, {
          available: true,
          $pull: { assignedRoutes: routeId }
        });
      }

      // Update orders status (assuming all are delivered)
      if (route.orders && route.orders.length > 0) {
        await Order.updateMany(
          { _id: { $in: route.orders } },
          { status: 'delivered' }
        );
      }

      return updatedRoute;
    } catch (error) {
      throw error;
    }
  }

  // Update waypoint status
  async updateWaypoint(routeId, waypointIndex, updateData) {
    try {
      const route = await this.getById(routeId);
      if (!route) {
        throw new Error('Route not found');
      }

      if (!route.waypoints[waypointIndex]) {
        throw new Error('Waypoint not found');
      }

      // Update waypoint
      const waypoint = route.waypoints[waypointIndex];
      if (updateData.completed !== undefined) waypoint.completed = updateData.completed;
      if (updateData.actualArrival) waypoint.actualArrival = updateData.actualArrival;
      if (updateData.notes) waypoint.notes = updateData.notes;

      await route.save();

      // Update corresponding order status if waypoint is completed
      if (updateData.completed && waypoint.orderId) {
        await Order.findByIdAndUpdate(waypoint.orderId, { status: 'delivered' });
      }

      return waypoint;
    } catch (error) {
      throw error;
    }
  }

  // Get route statistics
  async getRouteStats() {
    try {
      const total = await this.count();
      
      const statusStats = await this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const priorityStats = await this.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Average duration and distance
      const avgMetrics = await this.aggregate([
        {
          $match: {
            actualDuration: { $exists: true },
            actualDistance: { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$actualDuration' },
            avgDistance: { $avg: '$actualDistance' },
            totalRoutes: { $sum: 1 }
          }
        }
      ]);

      // Efficiency metrics
      const efficiencyStats = await this.aggregate([
        {
          $match: {
            estimatedDuration: { $exists: true },
            actualDuration: { $exists: true }
          }
        },
        {
          $project: {
            efficiency: {
              $multiply: [
                { $divide: ['$estimatedDuration', '$actualDuration'] },
                100
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgEfficiency: { $avg: '$efficiency' },
            onTimeRoutes: {
              $sum: {
                $cond: [{ $gte: ['$efficiency', 90] }, 1, 0]
              }
            },
            totalRoutes: { $sum: 1 }
          }
        }
      ]);

      return {
        totalRoutes: total,
        statusStats,
        priorityStats,
        avgDuration: avgMetrics[0]?.avgDuration || 0,
        avgDistance: avgMetrics[0]?.avgDistance || 0,
        efficiency: efficiencyStats[0] || { avgEfficiency: 0, onTimeRoutes: 0, totalRoutes: 0 }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get routes by driver
  async getDriverRoutes(driverId, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, assignedDriver: driverId };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get routes by vehicle
  async getVehicleRoutes(vehicleId, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, assignedVehicle: vehicleId };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get active routes
  async getActiveRoutes(queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, status: 'in-progress' };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Cancel route
  async cancelRoute(routeId, reason = '') {
    try {
      const route = await this.getById(routeId);
      if (!route) {
        throw new Error('Route not found');
      }

      if (route.status === 'completed') {
        throw new Error('Cannot cancel completed route');
      }

      // Update route status
      const updatedRoute = await this.update(routeId, {
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Route cancelled'
      });

      // Free up driver and vehicle
      if (route.assignedDriver) {
        await Driver.findByIdAndUpdate(route.assignedDriver, {
          status: 'available',
          $pull: { assignedRoutes: routeId }
        });
      }

      if (route.assignedVehicle) {
        await Vehicle.findByIdAndUpdate(route.assignedVehicle, {
          available: true,
          $pull: { assignedRoutes: routeId }
        });
      }

      // Reset orders status
      if (route.orders && route.orders.length > 0) {
        await Order.updateMany(
          { _id: { $in: route.orders } },
          { 
            status: 'open',
            $unset: { 
              assignedRoute: 1,
              assignedDriver: 1,
              assignedVehicle: 1
            }
          }
        );
      }

      return updatedRoute;
    } catch (error) {
      throw error;
    }
  }

  // Validate route data
  async validateRouteData(data, isUpdate = false) {
    try {
      const errors = [];

      // Check for duplicate route ID
      if (data.routeId && !isUpdate) {
        const exists = await this.exists({ routeId: data.routeId });
        if (exists) {
          errors.push('Route ID already exists');
        }
      }

      // Validate assigned driver
      if (data.assignedDriver) {
        const driver = await Driver.findById(data.assignedDriver);
        if (!driver) {
          errors.push('Assigned driver not found');
        } else if (driver.status !== 'available' && !isUpdate) {
          errors.push('Driver is not available');
        }
      }

      // Validate assigned vehicle
      if (data.assignedVehicle) {
        const vehicle = await Vehicle.findById(data.assignedVehicle);
        if (!vehicle) {
          errors.push('Assigned vehicle not found');
        } else if (!vehicle.available && !isUpdate) {
          errors.push('Vehicle is not available');
        }
      }

      // Validate orders
      if (data.orders && data.orders.length > 0) {
        const orders = await Order.find({ _id: { $in: data.orders } });
        if (orders.length !== data.orders.length) {
          errors.push('One or more orders not found');
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RouteService;