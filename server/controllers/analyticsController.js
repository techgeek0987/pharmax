const BaseController = require('./BaseController');
const AnalyticsService = require('../services/AnalyticsService');

const analyticsService = new AnalyticsService();
const baseController = new BaseController(analyticsService);

// Get all analytics with filtering, searching, sorting, and pagination
exports.getAllAnalytics = baseController.getAll.bind(baseController);

// Get single analytics by ID
exports.getAnalyticsById = baseController.getById.bind(baseController);

// Create new analytics
exports.createAnalytics = baseController.create.bind(baseController);

// Update analytics
exports.updateAnalytics = baseController.update.bind(baseController);

// Delete analytics
exports.deleteAnalytics = baseController.delete.bind(baseController);

// Get analytics statistics
exports.getAnalyticsStats = baseController.getStats.bind(baseController);

// Generate comprehensive dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { period = 'daily', days = 30 } = req.query;
    const data = await analyticsService.getDashboardAnalytics(period, days);

    res.status(200).json({
      success: true,
      message: 'Dashboard analytics retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
};

// Generate real-time metrics
exports.getRealTimeMetrics = async (req, res) => {
  try {
    const data = await analyticsService.getRealTimeMetrics();

    res.status(200).json({
      success: true,
      message: 'Real-time metrics retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching real-time metrics',
      error: error.message
    });
  }
};

// Generate performance reports
exports.getPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate, type = 'overview' } = req.query;
    const reportData = await analyticsService.generatePerformanceReport(startDate, endDate, type);

    res.status(200).json({
      success: true,
      message: 'Performance report generated successfully',
      data: reportData,
      reportType: type,
      period: { startDate: new Date(startDate), endDate: new Date(endDate) }
    });
  } catch (error) {
    console.error('Error generating performance report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating performance report',
      error: error.message
    });
  }
};

module.exports = exports;