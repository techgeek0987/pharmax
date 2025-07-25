const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications with filtering, searching, sorting, and pagination
router.get('/', notificationController.getAllNotifications);

// Create new notification
router.post('/', notificationController.createNotification);

// Get notifications for a specific user
router.get('/user/:userId', notificationController.getUserNotifications);

// Get notification statistics for a user
router.get('/user/:userId/stats', notificationController.getNotificationStats);

// Mark all notifications as read for a user
router.patch('/user/:userId/mark-all-read', notificationController.markAllAsRead);

// Get single notification by ID
router.get('/:id', notificationController.getNotificationById);

// Update notification
router.put('/:id', notificationController.updateNotification);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Mark notification as read
router.patch('/:notificationId/read', notificationController.markAsRead);

module.exports = router;