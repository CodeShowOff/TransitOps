const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');

const getDashboardKPIs = async (filters = {}) => {
  try {
    // Build vehicle query based on filters
    const vehicleQuery = {};
    if (filters.type) vehicleQuery.type = filters.type;
    if (filters.region) vehicleQuery.region = { $regex: filters.region, $options: 'i' };

    // If a status filter is provided, scope vehicle counts to that status
    const statusFilter = filters.status;

    const totalVehicles = await Vehicle.countDocuments(vehicleQuery);

    // activeVehicles: status != Retired (within filter scope)
    const activeVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: { $ne: 'Retired' } });

    // availableVehicles: status == Available
    const availableVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: 'Available' });

    // vehiclesInShop: status == In Shop
    const vehiclesInShop = await Vehicle.countDocuments({ ...vehicleQuery, status: 'In Shop' });

    // onTripVehicles for utilization
    const onTripVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: 'On Trip' });

    // If status filter is set, return focused count
    let filteredVehicleCount = null;
    if (statusFilter) {
      filteredVehicleCount = await Vehicle.countDocuments({ ...vehicleQuery, status: statusFilter });
    }

    // For trips, get vehicle IDs matching the filter to scope trips
    let tripQuery = {};
    if (filters.type || filters.region) {
      const matchingVehicleIds = await Vehicle.find(vehicleQuery).select('_id').lean();
      const vehicleIds = matchingVehicleIds.map(v => v._id);
      tripQuery.vehicle = { $in: vehicleIds };
    }

    // activeTrips: status == Dispatched
    const activeTrips = await Trip.countDocuments({ ...tripQuery, status: 'Dispatched' });

    // pendingTrips: status == Draft
    const pendingTrips = await Trip.countDocuments({ ...tripQuery, status: 'Draft' });

    // driversOnDuty: Available + On Trip
    const driversOnDuty = await Driver.countDocuments({ status: { $in: ['Available', 'On Trip'] } });

    // fleetUtilization: On Trip Vehicles / Total Active Vehicles * 100
    let fleetUtilization = 0;
    if (activeVehicles > 0) {
      fleetUtilization = Math.round((onTripVehicles / activeVehicles) * 100);
    }

    return {
      totalVehicles,
      activeVehicles,
      availableVehicles,
      vehiclesInShop,
      onTripVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
      filteredVehicleCount
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardKPIs
};
