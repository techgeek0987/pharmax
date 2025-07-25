const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Get all routes with filtering, searching, sorting, and pagination
router.get('/', routeController.getAllRoutes);

// Get route statistics
router.get('/stats', routeController.getRouteStats);

// Get single route by ID
router.get('/:id', routeController.getRouteById);

// Create new route
router.post('/', routeController.createRoute);

// Create optimized route
router.post('/optimize', routeController.createOptimizedRoute);

// Update route
router.put('/:id', routeController.updateRoute);

// Delete route
router.delete('/:id', routeController.deleteRoute);

// Start route
router.patch('/:id/start', routeController.startRoute);

// Complete route
router.patch('/:id/complete', routeController.completeRoute);

// Update waypoint status
router.patch('/:routeId/waypoints/:waypointIndex', routeController.updateWaypoint);

module.exports = router;