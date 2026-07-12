const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const FuelLog = require('../models/FuelLog');
const { validateTripForDispatch } = require('../utils/tripBusinessRules');

// Get all trips with pagination and filtering
exports.getTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, driver, vehicle, search } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (driver) query.driver = driver;
    if (vehicle) query.vehicle = vehicle;
    
    if (search) {
      query.$or = [
        { tripNumber: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    const trips = await Trip.find(query)
      .populate('vehicle', 'registrationNumber model')
      .populate('driver', 'name employeeId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Trip.countDocuments(query);

    res.status(200).json({
      success: true,
      data: trips,
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

// Create a new draft trip
exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance, revenue } = req.body;
    
    const trip = await Trip.create({
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
      revenue,
      status: 'Draft',
      // createdBy: req.user.id // assuming auth middleware sets req.user
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Dispatch a trip
exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Validate business rules
    const { vehicle, driver } = await validateTripForDispatch(trip);

    // Update status
    trip.status = 'Dispatched';
    trip.dispatchDate = new Date();
    await trip.save();

    // Update Vehicle and Driver statuses
    vehicle.status = 'On Trip';
    await vehicle.save();

    driver.status = 'On Trip';
    await driver.save();

    res.status(200).json({ success: true, data: trip, message: 'Trip dispatched successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Complete a trip
exports.completeTrip = async (req, res) => {
  try {
    const { finalOdometer, fuelConsumed, fuelPrice, actualDistance, revenue } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Rule 8: Trip can only complete from Dispatched
    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ success: false, message: 'Only dispatched trips can be completed.' });
    }

    trip.status = 'Completed';
    trip.completedDate = new Date();
    trip.actualDistance = actualDistance;
    trip.fuelConsumed = fuelConsumed;
    if (revenue !== undefined) trip.revenue = revenue;

    await trip.save();

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    // Update Vehicle
    if (vehicle) {
      vehicle.status = 'Available';
      vehicle.odometer = (vehicle.odometer || 0) + Number(actualDistance);
      await vehicle.save();
    }

    // Update Driver
    if (driver) {
      driver.status = 'Available';
      await driver.save();
    }

    // Automatically create Fuel Log
    if (fuelConsumed && fuelPrice && vehicle) {
      const fuelCost = fuelConsumed * fuelPrice;
      await FuelLog.create({
        vehicle: vehicle._id,
        trip: trip._id,
        liters: fuelConsumed,
        fuelPrice: fuelPrice,
        cost: fuelCost,
        odometer: vehicle.odometer,
        filledBy: req.user ? req.user.id : null,
        filledDate: new Date()
      });
    }

    res.status(200).json({ success: true, data: trip, message: 'Trip completed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel a trip
exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Rule 9: Cancelled only from Draft or Dispatched
    if (trip.status !== 'Draft' && trip.status !== 'Dispatched') {
      return res.status(400).json({ success: false, message: 'Trip cannot be cancelled from its current state.' });
    }

    const previousStatus = trip.status;
    trip.status = 'Cancelled';
    await trip.save();

    // If it was dispatched, we need to free the vehicle and driver
    if (previousStatus === 'Dispatched') {
      const vehicle = await Vehicle.findById(trip.vehicle);
      if (vehicle) {
        vehicle.status = 'Available';
        await vehicle.save();
      }

      const driver = await Driver.findById(trip.driver);
      if (driver) {
        driver.status = 'Available';
        await driver.save();
      }
    }

    res.status(200).json({ success: true, data: trip, message: 'Trip cancelled successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a draft trip
exports.deleteDraft = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.status !== 'Draft') {
      return res.status(400).json({ success: false, message: 'Only Draft trips can be deleted.' });
    }

    await trip.deleteOne();
    res.status(200).json({ success: true, message: 'Draft trip deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
