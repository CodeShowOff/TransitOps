const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');
const Driver = require('../models/Driver');

const getAnalyticsMetrics = async (filters = {}) => {
  try {
    // Build vehicle filter
    const vehicleQuery = {};
    if (filters.vehicleType) vehicleQuery.type = filters.vehicleType;
    if (filters.region) vehicleQuery.region = { $regex: filters.region, $options: 'i' };

    // Get matching vehicle IDs for scoping
    let vehicleIdFilter = null;
    if (filters.vehicleType || filters.region) {
      const matchingVehicles = await Vehicle.find(vehicleQuery).select('_id').lean();
      vehicleIdFilter = matchingVehicles.map(v => v._id);
    }

    // Build date filter
    let dateFilter = {};
    if (filters.dateRange) {
      // dateRange is expected as "YYYY-MM" (month input)
      const [year, month] = filters.dateRange.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      dateFilter = { $gte: startDate, $lte: endDate };
    }

    // --- Fuel aggregation ---
    const fuelMatch = {};
    if (vehicleIdFilter) fuelMatch.vehicle = { $in: vehicleIdFilter };
    if (filters.dateRange) fuelMatch.filledDate = dateFilter;

    const fuelRes = await FuelLog.aggregate([
      { $match: fuelMatch },
      { $group: { _id: null, totalCost: { $sum: '$cost' }, totalLiters: { $sum: '$liters' } } }
    ]);
    const fuelCost = fuelRes.length > 0 ? fuelRes[0].totalCost : 0;
    const totalLiters = fuelRes.length > 0 ? fuelRes[0].totalLiters : 0;

    // --- Maintenance Cost (from Expense collection) ---
    const maintExpenseMatch = { category: { $in: ['Maintenance', 'Repair'] } };
    if (vehicleIdFilter) maintExpenseMatch.vehicle = { $in: vehicleIdFilter };
    if (filters.dateRange) maintExpenseMatch.expenseDate = dateFilter;

    const maintRes = await Expense.aggregate([
      { $match: maintExpenseMatch },
      { $group: { _id: null, totalCost: { $sum: '$amount' } } }
    ]);
    const maintenanceCost = maintRes.length > 0 ? maintRes[0].totalCost : 0;

    // --- Other Expenses ---
    const expenseMatch = { category: { $nin: ['Maintenance', 'Repair'] } };
    if (vehicleIdFilter) expenseMatch.vehicle = { $in: vehicleIdFilter };
    if (filters.dateRange) expenseMatch.expenseDate = dateFilter;

    const expRes = await Expense.aggregate([
      { $match: expenseMatch },
      { $group: { _id: null, totalCost: { $sum: '$amount' } } }
    ]);
    const expense = expRes.length > 0 ? expRes[0].totalCost : 0;

    // --- Trips: Revenue and Distance ---
    const tripMatch = {};
    if (vehicleIdFilter) tripMatch.vehicle = { $in: vehicleIdFilter };
    if (filters.dateRange) tripMatch.completedDate = dateFilter;
    // Driver filter
    if (filters.driverStatus) {
      const matchingDrivers = await Driver.find({ status: filters.driverStatus }).select('_id').lean();
      const driverIds = matchingDrivers.map(d => d._id);
      tripMatch.driver = { $in: driverIds };
    }

    const tripRes = await Trip.aggregate([
      { $match: tripMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalDistance: { $sum: '$actualDistance' }
        }
      }
    ]);
    const revenue = tripRes.length > 0 ? tripRes[0].totalRevenue : 0;
    const totalDistance = tripRes.length > 0 ? tripRes[0].totalDistance : 0;

    // --- Fuel Efficiency ---
    let fuelEfficiency = 0;
    if (totalLiters > 0) {
      fuelEfficiency = Number((totalDistance / totalLiters).toFixed(2));
    }

    // --- Operational Cost ---
    const operationalCost = fuelCost + maintenanceCost + expense;
    const profit = revenue - operationalCost;

    // --- Fleet Utilization ---
    const activeVehicleQuery = vehicleQuery.type || vehicleQuery.region
      ? { ...vehicleQuery, status: { $ne: 'Retired' } }
      : { status: { $ne: 'Retired' } };
    const activeVehicles = await Vehicle.countDocuments(activeVehicleQuery);

    const onTripQuery = vehicleQuery.type || vehicleQuery.region
      ? { ...vehicleQuery, status: 'On Trip' }
      : { status: 'On Trip' };
    const onTripVehicles = await Vehicle.countDocuments(onTripQuery);

    let fleetUtilization = 0;
    if (activeVehicles > 0) {
      fleetUtilization = Math.round((onTripVehicles / activeVehicles) * 100);
    }

    // --- Vehicle ROI ---
    const acqQuery = vehicleQuery.type || vehicleQuery.region ? vehicleQuery : {};
    const vehRes = await Vehicle.aggregate([
      { $match: acqQuery },
      { $group: { _id: null, totalAcquisition: { $sum: '$acquisitionCost' } } }
    ]);
    const acquisitionCost = vehRes.length > 0 ? vehRes[0].totalAcquisition : 0;
    let roi = 0;
    if (acquisitionCost > 0) {
      roi = Number(((revenue - fuelCost - maintenanceCost) / acquisitionCost).toFixed(2));
    }

    return {
      fuelEfficiency,
      fuelCost,
      maintenanceCost,
      expense,
      operationalCost,
      revenue,
      profit,
      fleetUtilization,
      roi
    };
  } catch (error) {
    throw error;
  }
};

const getChartData = async () => {
  try {
    // Trip Status
    const tripStatusRes = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const tripStatus = tripStatusRes.map(item => ({ status: item._id, count: item.count }));

    // Fuel Cost Trend (Group by month of filledDate)
    const fuelTrendRes = await FuelLog.aggregate([
      {
        $group: {
          _id: { $month: '$filledDate' },
          cost: { $sum: '$cost' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fuelTrend = fuelTrendRes.map(item => ({
      month: monthNames[item._id - 1],
      cost: item.cost
    }));

    // Vehicle Type
    const vehicleTypeRes = await Vehicle.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const vehicleType = vehicleTypeRes.map(item => ({ type: item._id, count: item.count }));

    // Revenue vs Expense
    const metrics = await getAnalyticsMetrics();
    const revenueVsExpense = [
      { name: 'Revenue', value: metrics.revenue },
      { name: 'Expense', value: metrics.fuelCost + metrics.maintenanceCost + metrics.expense }
    ];

    return {
      tripStatus,
      fuelTrend,
      vehicleType,
      revenueVsExpense
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAnalyticsMetrics,
  getChartData
};
