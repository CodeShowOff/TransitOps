const Vehicle = require('../models/Vehicle');
const { validateVehicle } = require('../validations/vehicle.validation');

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private/Fleet Manager
const createVehicle = async (req, res) => {
  try {
    const { isValid, errors } = validateVehicle(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const { registrationNumber, model, type, maxLoadCapacity, odometer, acquisitionCost, region, status } = req.body;

    // Check if registration number already exists
    const existingVehicle = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (existingVehicle) {
      return res.status(400).json({ success: false, message: 'Registration Number already exists' });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      model,
      type,
      maxLoadCapacity,
      odometer,
      acquisitionCost,
      region,
      status: status || 'Available'
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle Created Successfully',
      vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private (Read access)
const getVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$or = [
        { registrationNumber: { $regex: req.query.search, $options: 'i' } },
        { model: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.region) {
      query.region = req.query.region;
    }

    const vehicles = await Vehicle.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Vehicle.countDocuments(query);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: vehicles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get a single vehicle
// @route   GET /api/vehicles/:id
// @access  Private (Read access)
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Fleet Manager
const updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Business rule: Cannot edit status manually if On Trip
    if (vehicle.status === 'On Trip' && req.body.status && req.body.status !== 'On Trip') {
      return res.status(400).json({ success: false, message: 'Cannot manually change status while On Trip' });
    }

    if (req.body.registrationNumber) {
      const existingVehicle = await Vehicle.findOne({ 
        registrationNumber: req.body.registrationNumber.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingVehicle) {
        return res.status(400).json({ success: false, message: 'Registration Number already exists' });
      }
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle Updated Successfully',
      data: vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a vehicle (Soft delete / Mark Retired)
// @route   DELETE /api/vehicles/:id
// @access  Private/Fleet Manager
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Business rule: Soft delete by setting status to 'Retired'
    vehicle.status = 'Retired';
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle marked as Retired',
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
