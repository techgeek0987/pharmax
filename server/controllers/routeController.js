const BaseController = require('./BaseController');
const RouteService = require('../services/RouteService');

const routeService = new RouteService();
const baseController = new BaseController(routeService);

// Get all routes with filtering, searching, sorting, and pagination
exports.getAllRoutes = baseController.getAll.bind(baseController);

// Get single route by ID
exports.getRouteById = baseController.getById.bind(baseController);

// Create new route
exports.createRoute = async (req, res) => {
    try {
        // Validate route data
        const validation = await routeService.validateRouteData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const route = await routeService.create(req.body);

        // Update related entities if route has assignments
        if (req.body.assignedDriver || req.body.assignedVehicle || req.body.orders) {
            await routeService.updateRelatedEntities(
                route._id,
                req.body.assignedDriver,
                req.body.assignedVehicle,
                req.body.orders
            );
        }

        res.status(201).json({
            success: true,
            message: 'Route created successfully',
            data: route
        });
    } catch (error) {
        console.error('Error creating route:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating route',
            error: error.message
        });
    }
};

// Update route
exports.updateRoute = baseController.update.bind(baseController);

// Delete route
exports.deleteRoute = baseController.delete.bind(baseController);

// Create optimized route
exports.createOptimizedRoute = async (req, res) => {
    try {
        const route = await routeService.createOptimizedRoute(req.body);

        res.status(201).json({
            success: true,
            message: 'Optimized route created successfully',
            data: route
        });
    } catch (error) {
        console.error('Error creating optimized route:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating optimized route',
            error: error.message
        });
    }
};

// Start route
exports.startRoute = async (req, res) => {
    try {
        const route = await routeService.startRoute(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Route started successfully',
            data: route
        });
    } catch (error) {
        console.error('Error starting route:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting route',
            error: error.message
        });
    }
};

// Complete route
exports.completeRoute = async (req, res) => {
    try {
        const route = await routeService.completeRoute(req.params.id, req.body.notes);

        res.status(200).json({
            success: true,
            message: 'Route completed successfully',
            data: route
        });
    } catch (error) {
        console.error('Error completing route:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing route',
            error: error.message
        });
    }
};

// Update waypoint status
exports.updateWaypoint = async (req, res) => {
    try {
        const { routeId, waypointIndex } = req.params;
        const waypoint = await routeService.updateWaypoint(routeId, waypointIndex, req.body);

        res.status(200).json({
            success: true,
            message: 'Waypoint updated successfully',
            data: waypoint
        });
    } catch (error) {
        console.error('Error updating waypoint:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating waypoint',
            error: error.message
        });
    }
};

// Get route statistics
exports.getRouteStats = async (req, res) => {
    try {
        const stats = await routeService.getRouteStats();

        res.status(200).json({
            success: true,
            message: 'Route statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        console.error('Error getting route stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving route statistics',
            error: error.message
        });
    }
};