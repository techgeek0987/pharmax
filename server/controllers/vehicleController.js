const BaseController = require('./BaseController');
const VehicleService = require('../services/VehicleService');

const vehicleService = new VehicleService();
const baseController = new BaseController(vehicleService);

// Get all vehicles with filtering, searching, sorting, and pagination
exports.getAllVehicles = baseController.getAll.bind(baseController);

// Get single vehicle by ID
exports.getVehicleById = baseController.getById.bind(baseController);

// Create new vehicle
exports.createVehicle = baseController.create.bind(baseController);

// Update vehicle
exports.updateVehicle = baseController.update.bind(baseController);

// Delete vehicle
exports.deleteVehicle = baseController.delete.bind(baseController);

// Get vehicle statistics
exports.getVehicleStats = baseController.getStats.bind(baseController);

// Custom vehicle-specific endpoints
exports.assignOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const vehicle = await vehicleService.assignOrder(req.params.id, orderId);

    res.status(200).json({
      success: true,
      message: 'Order assigned to vehicle successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error assigning order to vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning order to vehicle',
      error: error.message
    });
  }
};

exports.unassignOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const vehicle = await vehicleService.unassignOrder(req.params.id, orderId);

    res.status(200).json({
      success: true,
      message: 'Order unassigned from vehicle successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error unassigning order from vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error unassigning order from vehicle',
      error: error.message
    });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { available } = req.body;
    const vehicle = await vehicleService.updateAvailability(req.params.id, available);

    res.status(200).json({
      success: true,
      message: 'Vehicle availability updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle availability',
      error: error.message
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const vehicle = await vehicleService.updateLocation(req.params.id, location);

    res.status(200).json({
      success: true,
      message: 'Vehicle location updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle location',
      error: error.message
    });
  }
};

exports.getAvailable = async (req, res) => {
  try {
    const result = await vehicleService.getAvailable(req.query);

    res.status(200).json({
      success: true,
      message: 'Available vehicles retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting available vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving available vehicles',
      error: error.message
    });
  }
};

exports.getByType = async (req, res) => {
  try {
    const result = await vehicleService.getByType(req.params.type, req.query);

    res.status(200).json({
      success: true,
      message: `Vehicles of type '${req.params.type}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting vehicles by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vehicles by type',
      error: error.message
    });
  }
};

exports.getVehicleUtilization = async (req, res) => {
  try {
    const days = req.query.days || 30;
    const utilization = await vehicleService.getVehicleUtilization(req.params.id, days);

    res.status(200).json({
      success: true,
      message: 'Vehicle utilization retrieved successfully',
      data: utilization
    });
  } catch (error) {
    console.error('Error getting vehicle utilization:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vehicle utilization',
      error: error.message
    });
  }
};

exports.getByCapacityRequirements = async (req, res) => {
  try {
    const { minWeight } = req.query;
    const result = await vehicleService.getByCapacityRequirements(minWeight, req.query);

    res.status(200).json({
      success: true,
      message: 'Vehicles matching capacity requirements retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting vehicles by capacity:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vehicles by capacity requirements',
      error: error.message
    });
  }
};

exports.getMaintenanceAlerts = async (req, res) => {
  try {
    const alerts = await vehicleService.getMaintenanceAlerts();

    res.status(200).json({
      success: true,
      message: 'Maintenance alerts retrieved successfully',
      data: alerts
    });
  } catch (error) {
    console.error('Error getting maintenance alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving maintenance alerts',
      error: error.message
    });
  }
};

exports.getOptimalVehicleForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const vehicle = await vehicleService.getOptimalVehicleForOrder(orderId);

    res.status(200).json({
      success: true,
      message: 'Optimal vehicle for order retrieved successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error getting optimal vehicle for order:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving optimal vehicle for order',
      error: error.message
    });
  }
};