const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const { validateFuelLog } = require('../validations/fuel.validation');

// Get all fuel logs with pagination and filtering
exports.getFuelLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicle, trip } = req.query;
    
    let query = {};
    if (vehicle) query.vehicle = vehicle;
    if (trip) query.trip = trip;

    const logs = await FuelLog.find(query)
      .populate('vehicle', 'registrationNumber model')
      .populate('trip', 'tripNumber')
      .populate('filledBy', 'name')
      .sort({ filledDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await FuelLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
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

// Create a new fuel log manually
exports.createFuelLog = async (req, res) => {
  try {
    const { isValid, errors } = validateFuelLog(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }

    const { vehicle, trip, liters, fuelPrice, cost, odometer, filledDate } = req.body;

    const vehicleDoc = await Vehicle.findById(vehicle);
    if (!vehicleDoc) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (trip) {
      const tripDoc = await Trip.findById(trip);
      if (!tripDoc) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
    }

    const fuelLog = await FuelLog.create({
      vehicle,
      trip,
      liters,
      fuelPrice,
      cost,
      odometer,
      filledDate,
      filledBy: req.user ? req.user.id : null
    });

    res.status(201).json({ success: true, message: 'Fuel log created', data: fuelLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a fuel log
exports.deleteFuelLog = async (req, res) => {
  try {
    const fuelLog = await FuelLog.findById(req.params.id);
    if (!fuelLog) {
      return res.status(404).json({ success: false, message: 'Fuel log not found' });
    }

    await fuelLog.deleteOne();
    res.status(200).json({ success: true, message: 'Fuel log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
