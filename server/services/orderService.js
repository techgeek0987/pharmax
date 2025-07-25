const BaseService = require('./BaseService');
const Order = require('../models/Order');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

class OrderService extends BaseService {
  constructor() {
    const populateOptions = [
      { path: 'assignedDriver', select: 'name email phone status currentLocation' },
      { path: 'assignedVehicle', select: 'id type maxWeight available currentLocation' },
      { path: 'items.product', select: 'name sku price' }
    ];
    
    super(Order, 'Order', populateOptions);
  }

  // Custom search with order-specific fields
  async searchOrders(queryString) {
    const searchableFields = [
      'id',
      'orderNumber',
      'location',
      'customer.name',
      'customer.email',
      'assignee',
      'trackingNumber'
    ];
    
    return await this.search(queryString, searchableFields);
  }

  // Get orders by status
  async getByStatus(status, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, status };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get orders by type
  async getByType(type, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, type };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Assign driver and vehicle to order
  async assignOrder(orderId, vehicleId, driverId) {
    try {
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

      // Update order
      const order = await this.update(orderId, {
        assignedDriver: driverId,
        assignedVehicle: vehicleId,
        status: 'assigned'
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Update driver status
      await Driver.findByIdAndUpdate(driverId, {
        status: 'busy',
        $push: { assignedOrders: orderId }
      });

      // Update vehicle availability
      await Vehicle.findByIdAndUpdate(vehicleId, {
        available: false,
        $push: { assignedOrders: orderId }
      });

      return order;
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  async updateStatus(orderId, status, notes = '') {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Add to status history
      const statusUpdate = {
        status,
        updatedAt: Date.now()
      };

      if (notes) {
        statusUpdate.notes = notes;
      }

      // Update order
      const updatedOrder = await this.update(orderId, {
        status,
        $push: { statusHistory: statusUpdate }
      });

      // Handle status-specific logic
      if (status === 'completed' || status === 'delivered') {
        // Free up driver and vehicle
        if (order.assignedDriver) {
          await Driver.findByIdAndUpdate(order.assignedDriver, {
            status: 'available',
            $pull: { assignedOrders: orderId }
          });
        }

        if (order.assignedVehicle) {
          await Vehicle.findByIdAndUpdate(order.assignedVehicle, {
            available: true,
            $pull: { assignedOrders: orderId }
          });
        }
      }

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const total = await this.count();
      
      const statusStats = await this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const typeStats = await this.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const priorityStats = await this.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Revenue statistics
      const revenueStats = await this.aggregate([
        {
          $match: {
            totalAmount: { $exists: true, $ne: null },
            status: { $in: ['completed', 'delivered'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        }
      ]);

      // Monthly trends
      const monthlyTrends = await this.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      return {
        totalOrders: total,
        statusStats,
        typeStats,
        priorityStats,
        revenue: revenueStats[0] || { totalRevenue: 0, averageOrderValue: 0, orderCount: 0 },
        monthlyTrends
      };
    } catch (error) {
      throw error;
    }
  }

  // Get orders for a specific driver
  async getDriverOrders(driverId, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, assignedDriver: driverId };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get orders for a specific vehicle
  async getVehicleOrders(vehicleId, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, assignedVehicle: vehicleId };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get overdue orders
  async getOverdueOrders(queryString = {}) {
    try {
      const overdueFilter = {
        status: { $nin: ['completed', 'delivered', 'cancelled'] },
        'scheduledDelivery.date': { $lt: new Date() }
      };

      const orders = await Order.find(overdueFilter)
        .populate(this.populateOptions)
        .sort('-scheduledDelivery.date');

      return {
        data: orders,
        pagination: {
          page: 1,
          limit: orders.length,
          total: orders.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate tracking number
  async generateTrackingNumber() {
    try {
      let trackingNumber;
      let exists = true;

      while (exists) {
        trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        exists = await this.exists({ trackingNumber });
      }

      return trackingNumber;
    } catch (error) {
      throw error;
    }
  }

  // Validate order data
  async validateOrderData(data, isUpdate = false, orderId = null) {
    try {
      const errors = [];

      // Check for duplicate order ID
      if (data.id && !isUpdate) {
        const exists = await this.exists({ id: data.id });
        if (exists) {
          errors.push('Order ID already exists');
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

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;