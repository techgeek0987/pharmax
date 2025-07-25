const BaseService = require('./BaseService');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Order = require('../models/Order');

class VehicleService extends BaseService {
  constructor() {
    const populateOptions = [
      { path: 'assignedOrders', select: 'id location packages type status totalAmount' }
    ];

    super(Vehicle, 'Vehicle', populateOptions);
  }

  // Custom search with vehicle-specific fields
  async searchVehicles(queryString) {
    const searchableFields = [
      'id',
      'type',
      'maxWeight',
      'dimensions',
      'tags',
      'currentLocation'
    ];

    return await this.search(queryString, searchableFields);
  }

  // Get available vehicles
  async getAvailable(queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, available: true };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get vehicles by type
  async getByType(type, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, type };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Update vehicle availability
  async updateAvailability(vehicleId, available) {
    try {
      const vehicle = await this.getById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // If setting to unavailable and vehicle has assigned orders, prevent the action
      if (!available && vehicle.assignedOrders.length > 0) {
        throw new Error('Cannot make vehicle unavailable while it has assigned orders');
      }

      return await this.update(vehicleId, { available });
    } catch (error) {
      throw error;
    }
  }

  // Assign order to vehicle
  async assignOrder(vehicleId, orderId) {
    try {
      // Validate vehicle
      const vehicle = await this.getById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      if (!vehicle.available) {
        throw new Error('Vehicle is not available');
      }

      // Validate order
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'open') {
        throw new Error('Order is not available for assignment');
      }

      // Update vehicle
      const updatedVehicle = await this.update(vehicleId, {
        available: false,
        $push: { assignedOrders: orderId }
      });

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        status: 'assigned',
        assignedVehicle: vehicleId
      });

      return updatedVehicle;
    } catch (error) {
      throw error;
    }
  }

  // Unassign order from vehicle
  async unassignOrder(vehicleId, orderId) {
    try {
      const vehicle = await this.getById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Update vehicle
      const updatedVehicle = await this.update(vehicleId, {
        $pull: { assignedOrders: orderId }
      });

      // Check if vehicle has no more orders, set as available
      if (updatedVehicle.assignedOrders.length === 0) {
        await this.update(vehicleId, { available: true });
      }

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        status: 'open',
        $unset: { assignedVehicle: 1 }
      });

      return updatedVehicle;
    } catch (error) {
      throw error;
    }
  }

  // Update vehicle location
  async updateLocation(vehicleId, location) {
    try {
      return await this.update(vehicleId, { currentLocation: location });
    } catch (error) {
      throw error;
    }
  }

  // Get vehicle statistics
  async getVehicleStats() {
    try {
      const total = await this.count();

      const availabilityStats = await this.aggregate([
        { $group: { _id: '$available', count: { $sum: 1 } } }
      ]);

      const typeStats = await this.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Utilization metrics
      const utilizationStats = await this.aggregate([
        {
          $project: {
            type: 1,
            available: 1,
            assignedOrdersCount: { $size: '$assignedOrders' },
            utilization: {
              $cond: [
                { $eq: ['$available', false] },
                100,
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgUtilization: { $avg: '$utilization' },
            totalVehicles: { $sum: 1 },
            activeVehicles: {
              $sum: { $cond: [{ $eq: ['$available', false] }, 1, 0] }
            }
          }
        }
      ]);

      // Capacity analysis
      const capacityStats = await this.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgMaxWeight: { $avg: { $toDouble: { $substr: ['$maxWeight', 0, -3] } } }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        totalVehicles: total,
        availabilityStats,
        typeStats,
        utilization: utilizationStats[0] || { avgUtilization: 0, totalVehicles: 0, activeVehicles: 0 },
        capacityStats
      };
    } catch (error) {
      throw error;
    }
  }

  // Get vehicle utilization report
  async getVehicleUtilization(vehicleId, days = 30) {
    try {
      const vehicle = await this.getById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const utilization = await Order.aggregate([
        {
          $match: {
            assignedVehicle: vehicle._id,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            totalPackages: { $sum: '$packages' },
            totalRevenue: { $sum: '$totalAmount' },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]);

      // Calculate daily utilization
      const dailyUtilization = await Order.aggregate([
        {
          $match: {
            assignedVehicle: vehicle._id,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            ordersCount: { $sum: 1 },
            packagesCount: { $sum: '$packages' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return {
        vehicleId,
        vehicleType: vehicle.type,
        period: `${days} days`,
        summary: utilization[0] || {
          totalOrders: 0,
          completedOrders: 0,
          totalPackages: 0,
          totalRevenue: 0,
          avgOrderValue: 0
        },
        dailyUtilization
      };
    } catch (error) {
      throw error;
    }
  }

  // Get vehicles by capacity requirements
  async getByCapacityRequirements(minWeight, queryString = {}) {
    try {
      // Convert weight string to number for comparison
      const vehicles = await this.model.find({
        $expr: {
          $gte: [
            { $toDouble: { $substr: ['$maxWeight', 0, -3] } },
            minWeight
          ]
        }
      }).populate(this.populateOptions);

      return {
        data: vehicles,
        pagination: {
          page: 1,
          limit: vehicles.length,
          total: vehicles.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get maintenance alerts (vehicles with high usage)
  async getMaintenanceAlerts() {
    try {
      const highUsageThreshold = 50; // orders per month
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const maintenanceAlerts = await this.aggregate([
        {
          $lookup: {
            from: 'orders',
            let: { vehicleId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$assignedVehicle', '$$vehicleId'] },
                  createdAt: { $gte: thirtyDaysAgo }
                }
              }
            ],
            as: 'recentOrders'
          }
        },
        {
          $project: {
            id: 1,
            type: 1,
            maxWeight: 1,
            recentOrdersCount: { $size: '$recentOrders' },
            needsMaintenance: {
              $gte: [{ $size: '$recentOrders' }, highUsageThreshold]
            }
          }
        },
        {
          $match: { needsMaintenance: true }
        }
      ]);

      return maintenanceAlerts;
    } catch (error) {
      throw error;
    }
  }

  // Validate vehicle data
  async validateVehicleData(data, isUpdate = false, vehicleId = null) {
    try {
      const errors = [];

      // Check for duplicate vehicle ID
      if (data.id && !isUpdate) {
        const exists = await this.exists({ id: data.id });
        if (exists) {
          errors.push('Vehicle ID already exists');
        }
      }

      // Validate weight format
      if (data.maxWeight && !/^\d+\s*(kg|lb)$/i.test(data.maxWeight)) {
        errors.push('Max weight must be in format "1000 kg" or "2000 lb"');
      }

      // Validate dimensions format
      if (data.dimensions && !/^\d+-?\d*\s*(m³|ft³|cubic meters|cubic feet)$/i.test(data.dimensions)) {
        errors.push('Dimensions must be in format "15 m³" or "20 ft³"');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      throw error;
    }
  }

  // Get optimal vehicle for order
  async getOptimalVehicleForOrder(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Get available vehicles
      const availableVehicles = await this.model.find({ available: true });

      if (availableVehicles.length === 0) {
        throw new Error('No available vehicles');
      }

      // Simple optimization based on order type and package count
      let optimalVehicle = availableVehicles[0];

      for (const vehicle of availableVehicles) {
        // Prefer vehicles with appropriate capacity
        const vehicleWeight = parseInt(vehicle.maxWeight);
        const estimatedWeight = order.packages * 2; // Assume 2kg per package

        if (vehicleWeight >= estimatedWeight && vehicleWeight < parseInt(optimalVehicle.maxWeight)) {
          optimalVehicle = vehicle;
        }

        // Prefer specific vehicle types for specific order types
        if (order.type === 'REFRIGERATED' && vehicle.type.toLowerCase().includes('refrigerated')) {
          optimalVehicle = vehicle;
          break;
        }

        if (order.type === 'HEAVY' && vehicle.type.toLowerCase().includes('heavy')) {
          optimalVehicle = vehicle;
          break;
        }
      }

      return optimalVehicle;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VehicleService;