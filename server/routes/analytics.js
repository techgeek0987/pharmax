const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get all analytics with filtering, searching, sorting, and pagination
router.get('/', analyticsController.getAllAnalytics);

// Get analytics statistics
router.get('/stats', analyticsController.getAnalyticsStats);

// Get dashboard analytics
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// Get real-time metrics
router.get('/realtime', analyticsController.getRealTimeMetrics);

// Get performance reports
router.get('/reports', analyticsController.getPerformanceReport);

// Get single analytics by ID
router.get('/:id', analyticsController.getAnalyticsById);

// Create new analytics
router.post('/', analyticsController.createAnalytics);

// Update analytics
router.put('/:id', analyticsController.updateAnalytics);

// Delete analytics
router.delete('/:id', analyticsController.deleteAnalytics);

module.exports = router;