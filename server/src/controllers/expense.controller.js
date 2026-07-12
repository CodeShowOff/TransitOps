const Expense = require('../models/Expense');
const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const { validateExpense } = require('../validations/expense.validation');

// Get all expenses with pagination and filtering
exports.getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicle, category } = req.query;
    
    let query = {};
    if (vehicle) query.vehicle = vehicle;
    if (category) query.category = category;

    const expenses = await Expense.find(query)
      .populate('vehicle', 'registrationNumber model')
      .populate('trip', 'tripNumber')
      .sort({ expenseDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      data: expenses,
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

// Create a new expense manually
exports.createExpense = async (req, res) => {
  try {
    const { isValid, errors } = validateExpense(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }

    const { vehicle, trip, category, description, amount, expenseDate } = req.body;

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

    const expense = await Expense.create({
      vehicle,
      trip,
      category,
      description,
      amount,
      expenseDate
    });

    res.status(201).json({ success: true, message: 'Expense created', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get cost summary
exports.getExpenseSummary = async (req, res) => {
  try {
    const fuelCostAggr = await FuelLog.aggregate([{ $group: { _id: null, total: { $sum: '$cost' } } }]);
    const fuelCost = fuelCostAggr.length > 0 ? fuelCostAggr[0].total : 0;

    const maintenanceCostAggr = await Expense.aggregate([
      { $match: { category: 'Maintenance' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const maintenanceCost = maintenanceCostAggr.length > 0 ? maintenanceCostAggr[0].total : 0;

    const otherExpensesAggr = await Expense.aggregate([
      { $match: { category: { $ne: 'Maintenance' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const otherExpenses = otherExpensesAggr.length > 0 ? otherExpensesAggr[0].total : 0;

    const operationalCost = fuelCost + maintenanceCost + otherExpenses;

    // Calculate Average Fuel Efficiency
    // Fuel efficiency = Total Distance / Total Fuel Consumed
    const totalFuelAggr = await FuelLog.aggregate([{ $group: { _id: null, total: { $sum: '$liters' } } }]);
    const totalFuelConsumed = totalFuelAggr.length > 0 ? totalFuelAggr[0].total : 0;

    // Assuming we calculate distance from Trips that are Completed and have actualDistance
    const totalDistanceAggr = await Trip.aggregate([
      { $match: { status: 'Completed', actualDistance: { $ne: null } } },
      { $group: { _id: null, total: { $sum: '$actualDistance' } } }
    ]);
    const totalDistance = totalDistanceAggr.length > 0 ? totalDistanceAggr[0].total : 0;

    let averageFuelEfficiency = 0;
    if (totalFuelConsumed > 0) {
      averageFuelEfficiency = parseFloat((totalDistance / totalFuelConsumed).toFixed(2));
    }

    res.status(200).json({
      success: true,
      data: {
        fuelCost,
        maintenanceCost,
        otherExpenses,
        operationalCost,
        averageFuelEfficiency
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
