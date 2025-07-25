const BaseController = require('./BaseController');
const OrderService = require('../services/OrderService');

const orderService = new OrderService();
const baseController = new BaseController(orderService);

// Get all orders with filtering, searching, sorting, and pagination
exports.getAllOrders = baseController.getAll.bind(baseController);

// Get single order by ID
exports.getOrderById = baseController.getById.bind(baseController);

// Create new order
exports.createOrder = baseController.create.bind(baseController);

// Update order
exports.updateOrder = baseController.update.bind(baseController);

// Delete order
exports.deleteOrder = baseController.delete.bind(baseController);

// Get order statistics
exports.getOrderStats = baseController.getStats.bind(baseController);

// Custom order-specific endpoints
exports.assignOrder = async (req, res) => {
  try {
    const { vehicleId, driverId } = req.body;
    const order = await orderService.assignOrder(req.params.id, vehicleId, driverId);

    res.status(200).json({
      success: true,
      message: 'Order assigned successfully',
      data: order
    });
  } catch (error) {
    console.error('Error assigning order:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning order',
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await orderService.updateStatus(req.params.id, status, notes);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const result = await orderService.getByStatus(req.params.status, req.query);

    res.status(200).json({
      success: true,
      message: `Orders with status '${req.params.status}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting orders by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders by status',
      error: error.message
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await orderService.getDashboardStats();

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      error: error.message
    });
  }
};

exports.getOverdueOrders = async (req, res) => {
  try {
    const result = await orderService.getOverdueOrders(req.query);

    res.status(200).json({
      success: true,
      message: 'Overdue orders retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting overdue orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving overdue orders',
      error: error.message
    });
  }
};