const BaseService = require('./BaseService');
const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

class AnalyticsService extends BaseService {
  constructor() {
    super(Analytics);
  }

  // Generate comprehensive dashboard analytics
  async getDashboardAnalytics(period = 'daily', days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get order analytics
    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Get performance metrics
    const performanceMetrics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          avgDeliveryTime: { $avg: '$actualDuration' },
          onTimeDeliveries: {
            $sum: {
              $cond: [
                { $lte: ['$actualDeliveryTime', '$estimatedDeliveryTime'] },
                1,
                0
              ]
            }
          },
          totalDeliveries: { $sum: 1 }
        }
      }
    ]);

    // Get trend data
    const trendData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Get driver performance
    const driverPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          assignedDriver: { $exists: true }
        }
      },
      {
        $lookup: {
          from: 'drivers',
          localField: 'assignedDriver',
          foreignField: '_id',
          as: 'driver'
        }
      },
      {
        $unwind: '$driver'
      },
      {
        $group: {
          _id: '$assignedDriver',
          driverName: { $first: '$driver.name' },
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalAmount' },
          avgDeliveryTime: { $avg: '$actualDuration' }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completedOrders', '$totalOrders'] },
              100
            ]
          }
        }
      },
      { $sort: { completionRate: -1 } },
      { $limit: 10 }
    ]);

    return {
      overview: orderStats[0] || {},
      performance: performanceMetrics[0] || {},
      trends: trendData,
      topDrivers: driverPerformance,
      period: {
        start: startDate,
        end: endDate,
        days
      }
    };
  }

  // Generate real-time metrics
  async getRealTimeMetrics() {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Real-time order metrics
    const realTimeStats = await Order.aggregate([
      {
        $facet: {
          today: [
            {
              $match: {
                createdAt: { $gte: startOfToday, $lte: endOfToday }
              }
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                pendingOrders: {
                  $sum: { $cond: [{ $eq: ['$status', 'to-be-fulfilled'] }, 1, 0] }
                },
                inTransitOrders: {
                  $sum: { $cond: [{ $eq: ['$status', 'in-transit'] }, 1, 0] }
                },
                completedOrders: {
                  $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                revenue: { $sum: '$totalAmount' }
              }
            }
          ],
          hourly: [
            {
              $match: {
                createdAt: { $gte: startOfToday, $lte: endOfToday }
              }
            },
            {
              $group: {
                _id: { $hour: '$createdAt' },
                orders: { $sum: 1 },
                revenue: { $sum: '$totalAmount' }
              }
            },
            { $sort: { '_id': 1 } }
          ]
        }
      }
    ]);

    // Active drivers and vehicles
    const activeResources = await Driver.aggregate([
      {
        $facet: {
          drivers: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          vehicles: [
            {
              $lookup: {
                from: 'vehicles',
                localField: 'assignedVehicle',
                foreignField: '_id',
                as: 'vehicle'
              }
            },
            {
              $group: {
                _id: null,
                totalVehicles: { $sum: 1 },
                activeVehicles: {
                  $sum: { $cond: [{ $eq: ['$status', 'busy'] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    return {
      todayStats: realTimeStats[0].today[0] || {},
      hourlyTrend: realTimeStats[0].hourly,
      resources: {
        drivers: activeResources[0].drivers,
        vehicles: activeResources[0].vehicles[0] || {}
      },
      lastUpdated: new Date()
    };
  }

  // Generate performance reports
  async generatePerformanceReport(startDate, endDate, type = 'overview') {
    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (type) {
      case 'delivery':
        return await this.generateDeliveryReport(start, end);
      case 'driver':
        return await this.generateDriverReport(start, end);
      case 'revenue':
        return await this.generateRevenueReport(start, end);
      default:
        return await this.generateOverviewReport(start, end);
    }
  }

  // Helper methods for different report types
  async generateDeliveryReport(startDate, endDate) {
    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          onTimeDeliveries: {
            $sum: {
              $cond: [
                { $lte: ['$actualDeliveryTime', '$estimatedDeliveryTime'] },
                1,
                0
              ]
            }
          },
          avgDeliveryTime: { $avg: '$actualDuration' },
          deliveryAccuracy: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
  }

  async generateDriverReport(startDate, endDate) {
    return await Driver.aggregate([
      {
        $lookup: {
          from: 'orders',
          let: { driverId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$assignedDriver', '$$driverId'] },
                createdAt: { $gte: startDate, $lte: endDate }
              }
            }
          ],
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalOrders: { $size: '$orders' },
          completedOrders: {
            $size: {
              $filter: {
                input: '$orders',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          },
          totalRevenue: { $sum: '$orders.totalAmount' }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          status: 1,
          totalOrders: 1,
          completedOrders: 1,
          totalRevenue: 1,
          completionRate: {
            $cond: [
              { $gt: ['$totalOrders', 0] },
              { $multiply: [{ $divide: ['$completedOrders', '$totalOrders'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { completionRate: -1 } }
    ]);
  }

  async generateRevenueReport(startDate, endDate) {
    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          totalAmount: { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          dailyRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);
  }

  async generateOverviewReport(startDate, endDate) {
    const deliveryReport = await this.generateDeliveryReport(startDate, endDate);
    const revenueReport = await this.generateRevenueReport(startDate, endDate);
    const driverReport = await this.generateDriverReport(startDate, endDate);

    return {
      delivery: deliveryReport[0] || {},
      revenue: {
        daily: revenueReport,
        total: revenueReport.reduce((sum, day) => sum + day.dailyRevenue, 0)
      },
      drivers: {
        summary: driverReport.slice(0, 5),
        total: driverReport.length
      }
    };
  }
}

module.exports = AnalyticsService;