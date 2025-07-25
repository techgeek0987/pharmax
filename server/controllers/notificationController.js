const BaseController = require('./BaseController');
const NotificationService = require('../services/NotificationService');

const notificationService = new NotificationService();
const baseController = new BaseController(notificationService);

// Get all notifications with filtering, searching, sorting, and pagination
exports.getAllNotifications = baseController.getAll.bind(baseController);

// Get single notification by ID
exports.getNotificationById = baseController.getById.bind(baseController);

// Create new notification
exports.createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body, req.user?.id);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// Update notification
exports.updateNotification = baseController.update.bind(baseController);

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.delete(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await notificationService.getUserNotifications(userId, req.query);

    res.status(200).json({
      success: true,
      message: 'User notifications retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      unreadCount: result.unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await notificationService.markAsRead(notificationId, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await notificationService.getNotificationStats(userId);

    res.status(200).json({
      success: true,
      message: 'Notification statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching notification statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification statistics',
      error: error.message
    });
  }
};

// Auto-create notifications based on system events
exports.createSystemNotification = async (eventType, data) => {
  try {
    const notification = await notificationService.createSystemNotification(eventType, data);
    return notification;
  } catch (error) {
    console.error('Error creating system notification:', error);
    throw error;
  }
};

module.exports = exports;