const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');

const getAnalyticsMetrics = async () => {
  try {
    // 1. Total Fuel Cost
    const fuelRes = await FuelLog.aggregate([{ $group: { _id: null, totalCost: { $sum: '$cost' }, totalLiters: { $sum: '$liters' } } }]);
    const fuelCost = fuelRes.length > 0 ? fuelRes[0].totalCost : 0;
    const totalLiters = fuelRes.length > 0 ? fuelRes[0].totalLiters : 0;

    // 2. Total Maintenance Cost (Pulled from Expense collection to avoid double-counting since Maintenance auto-creates Expense)
    const maintRes = await Expense.aggregate([
      { $match: { category: { $in: ['Maintenance', 'Repair'] } } },
      { $group: { _id: null, totalCost: { $sum: '$amount' } } }
    ]);
    const maintenanceCost = maintRes.length > 0 ? maintRes[0].totalCost : 0;

    // 3. Total Expenses (Other Expenses excluding Maintenance/Repair)
    const expRes = await Expense.aggregate([
      { $match: { category: { $nin: ['Maintenance', 'Repair'] } } },
      { $group: { _id: null, totalCost: { $sum: '$amount' } } }
    ]);
    const expense = expRes.length > 0 ? expRes[0].totalCost : 0;

    // 4. Total Revenue and Distance
    const tripRes = await Trip.aggregate([{ 
      $group: { 
        _id: null, 
        totalRevenue: { $sum: '$revenue' },
        totalDistance: { $sum: '$actualDistance' }
      } 
    }]);
    const revenue = tripRes.length > 0 ? tripRes[0].totalRevenue : 0;
    const totalDistance = tripRes.length > 0 ? tripRes[0].totalDistance : 0;

    // 5. Fuel Efficiency
    let fuelEfficiency = 0;
    if (totalLiters > 0) {
      fuelEfficiency = Number((totalDistance / totalLiters).toFixed(2));
    }

    // 6. Profit
    const operationalCost = fuelCost + maintenanceCost + expense;
    const profit = revenue - operationalCost;

    // 7. ROI
    const vehRes = await Vehicle.aggregate([{ $group: { _id: null, totalAcquisition: { $sum: '$acquisitionCost' } } }]);
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
      revenue,
      profit,
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

    // Revenue vs Expense (Simple global for now or monthly)
    // To make a bar chart, we can just supply totals
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
