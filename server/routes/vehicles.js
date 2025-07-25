const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// GET /api/vehicles - Get all vehicles
router.get('/', vehicleController.getAllVehicles);

// GET /api/vehicles/stats - Get vehicle statistics
router.get('/stats', vehicleController.getVehicleStats);

// GET /api/vehicles/available - Get available vehicles
router.get('/available', vehicleController.getAvailable);

// GET /api/vehicles/maintenance-alerts - Get maintenance alerts
router.get('/maintenance-alerts', vehicleController.getMaintenanceAlerts);

// GET /api/vehicles/type/:type - Get vehicles by type
router.get('/type/:type', vehicleController.getByType);

// GET /api/vehicles/capacity - Get vehicles by capacity requirements
router.get('/capacity', vehicleController.getByCapacityRequirements);

// GET /api/vehicles/:id - Get single vehicle
router.get('/:id', vehicleController.getVehicleById);

// GET /api/vehicles/:id/utilization - Get vehicle utilization
router.get('/:id/utilization', vehicleController.getVehicleUtilization);

// POST /api/vehicles - Create new vehicle
router.post('/', vehicleController.createVehicle);

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', vehicleController.updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', vehicleController.deleteVehicle);

// POST /api/vehicles/:id/assign - Assign order to vehicle
router.post('/:id/assign', vehicleController.assignOrder);

// POST /api/vehicles/:id/unassign - Unassign order from vehicle
router.post('/:id/unassign', vehicleController.unassignOrder);

// PATCH /api/vehicles/:id/availability - Update vehicle availability
router.patch('/:id/availability', vehicleController.updateAvailability);

// PATCH /api/vehicles/:id/location - Update vehicle location
router.patch('/:id/location', vehicleController.updateLocation);

// GET /api/vehicles/optimal/:orderId - Get optimal vehicle for order
router.get('/optimal/:orderId', vehicleController.getOptimalVehicleForOrder);

module.exports = router;