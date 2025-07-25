const BaseController = require('./BaseController');
const DriverService = require('../services/DriverService');

const driverService = new DriverService();
const baseController = new BaseController(driverService);

// Get all drivers with filtering, searching, sorting, and pagination
exports.getAllDrivers = baseController.getAll.bind(baseController);

// Get single driver by ID
exports.getDriverById = baseController.getById.bind(baseController);

// Create new driver
exports.createDriver = baseController.create.bind(baseController);

// Update driver
exports.updateDriver = baseController.update.bind(baseController);

// Delete driver
exports.deleteDriver = baseController.delete.bind(baseController);

// Get driver statistics
exports.getDriverStats = baseController.getStats.bind(baseController);

// Custom driver-specific endpoints
exports.assignVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const driver = await driverService.assignVehicle(req.params.id, vehicleId);

    res.status(200).json({
      success: true,
      message: 'Vehicle assigned to driver successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error assigning vehicle to driver:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning vehicle to driver',
      error: error.message
    });
  }
};

exports.unassignVehicle = async (req, res) => {
  try {
    const driver = await driverService.unassignVehicle(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vehicle unassigned from driver successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error unassigning vehicle from driver:', error);
    res.status(500).json({
      success: false,
      message: 'Error unassigning vehicle from driver',
      error: error.message
    });
  }
};

exports.assignOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const driver = await driverService.assignOrder(req.params.id, orderId);

    res.status(200).json({
      success: true,
      message: 'Order assigned to driver successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error assigning order to driver:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning order to driver',
      error: error.message
    });
  }
};

exports.unassignOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const driver = await driverService.unassignOrder(req.params.id, orderId);

    res.status(200).json({
      success: true,
      message: 'Order unassigned from driver successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error unassigning order from driver:', error);
    res.status(500).json({
      success: false,
      message: 'Error unassigning order from driver',
      error: error.message
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const driver = await driverService.updateStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: 'Driver status updated successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating driver status',
      error: error.message
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const driver = await driverService.updateLocation(req.params.id, location);

    res.status(200).json({
      success: true,
      message: 'Driver location updated successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating driver location',
      error: error.message
    });
  }
};

exports.getAvailable = async (req, res) => {
  try {
    const result = await driverService.getAvailable(req.query);

    res.status(200).json({
      success: true,
      message: 'Available drivers retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting available drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving available drivers',
      error: error.message
    });
  }
};

exports.getByStatus = async (req, res) => {
  try {
    const result = await driverService.getByStatus(req.params.status, req.query);

    res.status(200).json({
      success: true,
      message: `Drivers with status '${req.params.status}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting drivers by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving drivers by status',
      error: error.message
    });
  }
};

exports.getDriverPerformance = async (req, res) => {
  try {
    const days = req.query.days || 30;
    const performance = await driverService.getDriverPerformance(req.params.id, days);

    res.status(200).json({
      success: true,
      message: 'Driver performance retrieved successfully',
      data: performance
    });
  } catch (error) {
    console.error('Error getting driver performance:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving driver performance',
      error: error.message
    });
  }
};

exports.getDriversWithExpiringLicenses = async (req, res) => {
  try {
    const days = req.query.days || 30;
    const result = await driverService.getDriversWithExpiringLicenses(days);

    res.status(200).json({
      success: true,
      message: 'Drivers with expiring licenses retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting drivers with expiring licenses:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving drivers with expiring licenses',
      error: error.message
    });
  }
};