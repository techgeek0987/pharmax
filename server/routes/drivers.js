const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// GET /api/drivers - Get all drivers
router.get('/', driverController.getAllDrivers);

// GET /api/drivers/stats - Get driver statistics
router.get('/stats', driverController.getDriverStats);

// GET /api/drivers/available - Get available drivers
router.get('/available', driverController.getAvailable);

// GET /api/drivers/expiring-licenses - Get drivers with expiring licenses
router.get('/expiring-licenses', driverController.getDriversWithExpiringLicenses);

// GET /api/drivers/status/:status - Get drivers by status
router.get('/status/:status', driverController.getByStatus);

// GET /api/drivers/:id - Get single driver
router.get('/:id', driverController.getDriverById);

// GET /api/drivers/:id/performance - Get driver performance
router.get('/:id/performance', driverController.getDriverPerformance);

// POST /api/drivers - Create new driver
router.post('/', driverController.createDriver);

// PUT /api/drivers/:id - Update driver
router.put('/:id', driverController.updateDriver);

// DELETE /api/drivers/:id - Delete driver
router.delete('/:id', driverController.deleteDriver);

// POST /api/drivers/:id/assign-vehicle - Assign vehicle to driver
router.post('/:id/assign-vehicle', driverController.assignVehicle);

// POST /api/drivers/:id/unassign-vehicle - Unassign vehicle from driver
router.post('/:id/unassign-vehicle', driverController.unassignVehicle);

// POST /api/drivers/:id/assign-order - Assign order to driver
router.post('/:id/assign-order', driverController.assignOrder);

// POST /api/drivers/:id/unassign-order - Unassign order from driver
router.post('/:id/unassign-order', driverController.unassignOrder);

// PATCH /api/drivers/:id/status - Update driver status
router.patch('/:id/status', driverController.updateStatus);

// PATCH /api/drivers/:id/location - Update driver location
router.patch('/:id/location', driverController.updateLocation);

module.exports = router;