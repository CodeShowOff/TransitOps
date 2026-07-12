const Driver = require('../models/Driver');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
exports.getDrivers = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let query = { isActive: true }; // Only get active drivers (soft delete)
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const drivers = await Driver.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private
exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver || !driver.isActive) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private (Fleet Manager, Safety Officer)
exports.createDriver = async (req, res) => {
  try {
    const { employeeId, licenseNumber, phone, licenseExpiry } = req.body;
    
    // Check for future date on license expiry
    if (new Date(licenseExpiry) <= new Date()) {
      return res.status(400).json({ success: false, message: 'License expiry must be a future date' });
    }
    
    // Check uniqueness
    const existingDriver = await Driver.findOne({
      $or: [
        { employeeId: employeeId.toUpperCase() },
        { licenseNumber: licenseNumber.toUpperCase() },
        { phone }
      ]
    });
    
    if (existingDriver) {
      if (existingDriver.employeeId.toUpperCase() === employeeId.toUpperCase()) {
        return res.status(400).json({ success: false, message: 'Employee ID already exists' });
      }
      if (existingDriver.licenseNumber.toUpperCase() === licenseNumber.toUpperCase()) {
        return res.status(400).json({ success: false, message: 'License Number already exists' });
      }
      if (existingDriver.phone === phone) {
        return res.status(400).json({ success: false, message: 'Phone number already exists' });
      }
    }
    
    const driver = await Driver.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Fleet Manager, Safety Officer)
exports.updateDriver = async (req, res) => {
  try {
    let driver = await Driver.findById(req.params.id);
    
    if (!driver || !driver.isActive) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    if (req.body.licenseExpiry && new Date(req.body.licenseExpiry) <= new Date()) {
      return res.status(400).json({ success: false, message: 'License expiry must be a future date' });
    }

    // Handle uniqueness check for updates
    if (req.body.employeeId || req.body.licenseNumber || req.body.phone) {
      const orQuery = [];
      if (req.body.employeeId) orQuery.push({ employeeId: req.body.employeeId.toUpperCase() });
      if (req.body.licenseNumber) orQuery.push({ licenseNumber: req.body.licenseNumber.toUpperCase() });
      if (req.body.phone) orQuery.push({ phone: req.body.phone });

      const existingDriver = await Driver.findOne({
        _id: { $ne: req.params.id },
        $or: orQuery
      });

      if (existingDriver) {
        return res.status(400).json({ success: false, message: 'Employee ID, License Number, or Phone already in use' });
      }
    }
    
    driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Fleet Manager)
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver || !driver.isActive) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    // Soft delete
    driver.isActive = false;
    await driver.save();
    
    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
