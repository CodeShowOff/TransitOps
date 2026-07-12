const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// Get all maintenance records with pagination and filtering
exports.getMaintenances = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, vehicle, search } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (vehicle) query.vehicle = vehicle;
    
    const maintenances = await Maintenance.find(query)
      .populate('vehicle', 'registrationNumber model')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Maintenance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: maintenances,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get a single maintenance record
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('vehicle', 'registrationNumber model')
      .populate('createdBy', 'name');

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create a new maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const { vehicle, serviceType, description, workshop, scheduledDate, estimatedCost } = req.body;

    // Rule 1: Vehicle must exist
    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Rule 2: Vehicle cannot already have Active Maintenance
    const activeMaintenance = await Maintenance.findOne({ vehicle, status: 'Active' });
    if (activeMaintenance) {
      return res.status(400).json({ success: false, message: 'Vehicle already has an active maintenance record' });
    }

    const maintenance = await Maintenance.create({
      vehicle,
      serviceType,
      description,
      workshop,
      scheduledDate,
      estimatedCost,
      createdBy: req.user ? req.user.id : null // Assuming req.user is set by auth middleware
    });

    // Rule 3: Vehicle Status -> In Shop
    vehicleDoc.status = 'In Shop';
    await vehicleDoc.save();

    res.status(201).json({
      success: true,
      message: 'Maintenance Created',
      maintenance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Complete a maintenance record
exports.completeMaintenance = async (req, res) => {
  try {
    const { completedDate, actualCost } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    // Rule 6: Cannot be completed twice
    if (maintenance.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Maintenance is already completed' });
    }

    maintenance.status = 'Completed';
    maintenance.completedDate = completedDate || Date.now();
    maintenance.actualCost = actualCost;
    
    await maintenance.save();

    // Rule 5: Complete Maintenance Automatically Vehicle -> Available (unless Retired)
    const vehicleDoc = await Vehicle.findById(maintenance.vehicle);
    if (vehicleDoc && vehicleDoc.status !== 'Retired') {
      vehicleDoc.status = 'Available';
      await vehicleDoc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance Completed',
      data: maintenance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a maintenance record
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    if (maintenance.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Cannot delete a completed maintenance record' });
    }

    // If it's active, revert vehicle status to Available
    const vehicleDoc = await Vehicle.findById(maintenance.vehicle);
    if (vehicleDoc && vehicleDoc.status === 'In Shop') {
      vehicleDoc.status = 'Available';
      await vehicleDoc.save();
    }

    await maintenance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
