const BaseService = require('./BaseService');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Order = require('../models/Order');

class DriverService extends BaseService {
  constructor() {
    const populateOptions = [
      { path: 'assignedVehicle', select: 'id type maxWeight available' },
      { path: 'assignedOrders', select: 'id location packages type status totalAmount' }
    ];
    
    super(Driver, 'Driver', populateOptions);
  }

  // Custom search with driver-specific fields
  async searchDrivers(queryString) {
    const searchableFields = [
      'id',
      'name',
      'email',
      'phone',
      'licenseNumber',
      'currentLocation'
    ];
    
    return await this.search(queryString, searchableFields);
  }

  // Get drivers by status
  async getByStatus(status, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, status };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get available drivers
  async getAvailable(queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, status: 'available' };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Assign vehicle to driver
  async assignVehicle(driverId, vehicleId) {
    try {
      // Validate driver
      const driver = await this.getById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      // Validate vehicle
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      if (!vehicle.available) {
        throw new Error('Vehicle is not available');
      }

      // Check if driver already has a vehicle assigned
      if (driver.assignedVehicle) {
        // Free up the previous vehicle
        await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
          available: true
        });
      }

      // Update driver
      const updatedDriver = await this.update(driverId, {
        assignedVehicle: vehicleId
      });

      // Update vehicle
      await Vehicle.findByIdAndUpdate(vehicleId, {
        available: false
      });

      return updatedDriver;
    } catch (error) {
      throw error;
    }
  }

  // Unassign vehicle from driver
  async unassignVehicle(driverId) {
    try {
      const driver = await this.getById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      if (!driver.assignedVehicle) {
        throw new Error('Driver has no assigned vehicle');
      }

      // Free up the vehicle
      await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
        available: true
      });

      // Update driver
      const updatedDriver = await this.update(driverId, {
        $unset: { assignedVehicle: 1 }
      });

      return updatedDriver;
    } catch (error) {
      throw error;
    }
  }

  // Assign order to driver
  async assignOrder(driverId, orderId) {
    try {
      // Validate driver
      const driver = await this.getById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      if (driver.status !== 'available') {
        throw new Error('Driver is not available');
      }

      // Validate order
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'open') {
        throw new Error('Order is not available for assignment');
      }

      // Update driver
      const updatedDriver = await this.update(driverId, {
        status: 'busy',
        $push: { assignedOrders: orderId }
      });

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        status: 'assigned',
        assignedDriver: driverId
      });

      return updatedDriver;
    } catch (error) {
      throw error;
    }
  }

  // Unassign order from driver
  async unassignOrder(driverId, orderId) {
    try {
      const driver = await this.getById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      // Update driver
      const updatedDriver = await this.update(driverId, {
        $pull: { assignedOrders: orderId }
      });

      // Check if driver has no more orders, set status to available
      if (updatedDriver.assignedOrders.length === 0) {
        await this.update(driverId, { status: 'available' });
      }

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        status: 'open',
        $unset: { assignedDriver: 1 }
      });

      return updatedDriver;
    } catch (error) {
      throw error;
    }
  }

  // Update driver status
  async updateStatus(driverId, status) {
    try {
      const driver = await this.getById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      // If setting to offline, unassign all orders
      if (status === 'offline' && driver.assignedOrders.length > 0) {
        await Order.updateMany(
          { _id: { $in: driver.assignedOrders } },
          { 
            status: 'open',
            $unset: { assignedDriver: 1 }
          }
        );

        // Clear assigned orders
        await this.update(driverId, {
          status,
          assignedOrders: []
        });
      } else {
        await this.update(driverId, { status });
      }

      return await this.getById(driverId);
    } catch (error) {
      throw error;
    }
  }

  // Update driver location
  async updateLocation(driverId, location) {
    try {
      return await this.update(driverId, { currentLocation: location });
    } catch (error) {
      throw error;
    }
  }

  // Get driver statistics
  async getDriverStats() {
    try {
      const total = await this.count();
      
      const statusStats = await this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Performance metrics
      const performanceStats = await this.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'assignedDriver',
            as: 'completedOrders'
          }
        },
        {
          $project: {
            name: 1,
            status: 1,
            completedOrdersCount: {
              $size: {
                $filter: {
                  input: '$completedOrders',
                  cond: { $eq: ['$$this.status', 'delivered'] }
                }
              }
            },
            totalOrdersCount: { $size: '$completedOrders' }
          }
        },
        {
          $group: {
            _id: null,
            avgCompletedOrders: { $avg: '$completedOrdersCount' },
            totalDrivers: { $sum: 1 },
            topPerformers: {
              $push: {
                $cond: [
                  { $gte: ['$completedOrdersCount', 10] },
                  { name: '$name', completedOrders: '$completedOrdersCount' },
                  null
                ]
              }
            }
          }
        }
      ]);

      // License expiry alerts
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringLicenses = await this.model.find({
        licenseExpiry: {
          $exists: true,
          $lte: thirtyDaysFromNow
        }
      }).select('name licenseNumber licenseExpiry');

      return {
        totalDrivers: total,
        statusStats,
        performance: performanceStats[0] || { avgCompletedOrders: 0, totalDrivers: 0, topPerformers: [] },
        expiringLicenses: expiringLicenses.filter(license => license !== null)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get driver performance metrics
  async getDriverPerformance(driverId, days = 30) {
    try {
      const driver = await this.getById(driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const performance = await Order.aggregate([
        {
          $match: {
            assignedDriver: driver._id,
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
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            totalRevenue: { $sum: '$totalAmount' },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]);

      const completionRate = performance[0] ? 
        (performance[0].completedOrders / performance[0].totalOrders * 100).toFixed(2) : 0;

      return {
        driverId,
        driverName: driver.name,
        period: `${days} days`,
        metrics: performance[0] || {
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0
        },
        completionRate: parseFloat(completionRate)
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate driver data
  async validateDriverData(data, isUpdate = false, driverId = null) {
    try {
      const errors = [];

      // Check for duplicate driver ID
      if (data.id && !isUpdate) {
        const exists = await this.exists({ id: data.id });
        if (exists) {
          errors.push('Driver ID already exists');
        }
      }

      // Check for duplicate email
      if (data.email) {
        const emailFilter = { email: data.email };
        if (isUpdate && driverId) {
          emailFilter._id = { $ne: driverId };
        }
        const emailExists = await this.exists(emailFilter);
        if (emailExists) {
          errors.push('Email already exists');
        }
      }

      // Check for duplicate license number
      if (data.licenseNumber) {
        const licenseFilter = { licenseNumber: data.licenseNumber };
        if (isUpdate && driverId) {
          licenseFilter._id = { $ne: driverId };
        }
        const licenseExists = await this.exists(licenseFilter);
        if (licenseExists) {
          errors.push('License number already exists');
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

  // Get drivers with expiring licenses
  async getDriversWithExpiringLicenses(days = 30) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const drivers = await this.model.find({
        licenseExpiry: {
          $exists: true,
          $lte: expiryDate
        }
      }).sort('licenseExpiry');

      return {
        data: drivers,
        pagination: {
          page: 1,
          limit: drivers.length,
          total: drivers.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DriverService;