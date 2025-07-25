const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders - Get all orders
router.get('/', orderController.getAllOrders);

// GET /api/orders/stats - Get order statistics
router.get('/stats', orderController.getOrderStats);

// GET /api/orders/stats/dashboard - Get dashboard statistics (must be before /:id)
router.get('/stats/dashboard', orderController.getDashboardStats);

// GET /api/orders/overdue - Get overdue orders
router.get('/overdue', orderController.getOverdueOrders);

// GET /api/orders/status/:status - Get orders by status
router.get('/status/:status', orderController.getOrdersByStatus);

// GET /api/orders/:id - Get single order
router.get('/:id', orderController.getOrderById);

// POST /api/orders - Create new order
router.post('/', orderController.createOrder);

// PUT /api/orders/:id - Update order
router.put('/:id', orderController.updateOrder);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', orderController.deleteOrder);

// POST /api/orders/:id/assign - Assign vehicle/driver to order
router.post('/:id/assign', orderController.assignOrder);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;