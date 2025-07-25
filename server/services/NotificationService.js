const BaseService = require('./BaseService');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');

class NotificationService extends BaseService {
  constructor() {
    super(Notification);
  }

  // Get notifications for a user
  async getUserNotifications(userId, options = {}) {
    const { status = 'all', category, limit = 20, page = 1 } = options;

    const query = {
      'recipients.userId': userId
    };

    if (status !== 'all') {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const notifications = await this.model.find(query)
      .populate('relatedEntity.entityId')
      .populate('metadata.triggeredBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await this.model.countDocuments(query);
    const unreadCount = await this.model.countDocuments({
      'recipients.userId': userId,
      'recipients.readAt': { $exists: false },
      status: { $in: ['pending', 'sent'] }
    });

    return {
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      },
      unreadCount
    };
  }

  // Create a new notification
  async createNotification(notificationData, triggeredBy = null) {
    const {
      title,
      message,
      type = 'info',
      category,
      priority = 'medium',
      recipients,
      relatedEntity,
      actions,
      scheduledFor,
      expiresAt
    } = notificationData;

    const notification = new this.model({
      title,
      message,
      type,
      category,
      priority,
      recipients: recipients.map(recipient => ({
        userId: recipient.userId,
        role: recipient.role
      })),
      relatedEntity,
      actions,
      scheduledFor,
      expiresAt,
      metadata: {
        triggeredBy,
        source: 'manual'
      }
    });

    await notification.save();

    // Populate for response
    await notification.populate('recipients.userId', 'name email');
    await notification.populate('metadata.triggeredBy', 'name email');

    // TODO: Implement real-time push notification here
    // await this.sendRealTimeNotification(notification);

    return notification;
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    const notification = await this.model.findOneAndUpdate(
      {
        _id: notificationId,
        'recipients.userId': userId
      },
      {
        $set: {
          'recipients.$.readAt': new Date()
        }
      },
      { new: true }
    );

    return notification;
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    const result = await this.model.updateMany(
      {
        'recipients.userId': userId,
        'recipients.readAt': { $exists: false }
      },
      {
        $set: {
          'recipients.$.readAt': new Date()
        }
      }
    );

    return result;
  }

  // Get notification statistics
  async getNotificationStats(userId) {
    const stats = await this.model.aggregate([
      {
        $match: {
          'recipients.userId': mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [
                { $not: { $ifNull: ['$recipients.readAt', false] } },
                1,
                0
              ]
            }
          },
          byCategory: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              count: 1
            }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      unread: 0,
      byCategory: [],
      byPriority: []
    };
  }

  // Auto-create notifications based on system events
  async createSystemNotification(eventType, data) {
    let notification = {};

    switch (eventType) {
      case 'order_created':
        notification = {
          title: 'New Order Created',
          message: `Order ${data.orderId} has been created and needs assignment`,
          type: 'info',
          category: 'order',
          priority: data.urgency || 'medium',
          relatedEntity: {
            entityType: 'Order',
            entityId: data.orderObjectId
          }
        };
        break;

      case 'order_delayed':
        notification = {
          title: 'Order Delayed',
          message: `Order ${data.orderId} is running behind schedule`,
          type: 'warning',
          category: 'order',
          priority: 'high',
          relatedEntity: {
            entityType: 'Order',
            entityId: data.orderObjectId
          }
        };
        break;

      case 'driver_offline':
        notification = {
          title: 'Driver Offline',
          message: `Driver ${data.driverName} has gone offline during active delivery`,
          type: 'error',
          category: 'driver',
          priority: 'critical',
          relatedEntity: {
            entityType: 'Driver',
            entityId: data.driverObjectId
          }
        };
        break;

      case 'low_inventory':
        notification = {
          title: 'Low Inventory Alert',
          message: `Product ${data.productName} is running low (${data.quantity} remaining)`,
          type: 'warning',
          category: 'inventory',
          priority: 'medium',
          relatedEntity: {
            entityType: 'Product',
            entityId: data.productObjectId
          }
        };
        break;

      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }

    // Get admin users to notify
    const adminUsers = await User.find({ role: 'admin' });
    notification.recipients = adminUsers.map(user => ({
      userId: user._id,
      role: user.role
    }));

    notification.metadata = {
      source: 'system',
      automatedRule: eventType
    };

    const newNotification = new this.model(notification);
    await newNotification.save();

    // TODO: Send real-time notification
    // await this.sendRealTimeNotification(newNotification);

    return newNotification;
  }

  // Send real-time notification (placeholder for future implementation)
  async sendRealTimeNotification(notification) {
    // TODO: Implement WebSocket or push notification logic
    console.log('Real-time notification sent:', notification.title);
  }
}

module.exports = NotificationService;