const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const Maintenance = require('../models/Maintenance');

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

    // Generate alerts
    const alerts = [];

    // 1. License Expiry (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const driversExpiring = await Driver.find({
      licenseExpiry: { $lte: thirtyDaysFromNow }
    }).lean();
    
    driversExpiring.forEach(driver => {
      const diffTime = new Date(driver.licenseExpiry) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let message;
      if (diffDays < 0) {
        message = `${driver.name}: License expired ${Math.abs(diffDays)} days ago`;
      } else if (diffDays === 0) {
        message = `${driver.name}: License expires today`;
      } else {
        message = `${driver.name}: License expires in ${diffDays} days`;
      }
      alerts.push({ id: `driver-${driver._id}`, type: 'warning', message });
    });

    // 2. Maintenance Due (Active and scheduled within 7 days or overdue)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const maintenancesDue = await Maintenance.find({
      status: 'Active',
      scheduledDate: { $lte: sevenDaysFromNow }
    }).populate('vehicle', 'registrationNumber').lean();
    
    maintenancesDue.forEach(maint => {
      const diffTime = new Date(maint.scheduledDate) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let message;
      const regNo = maint.vehicle ? maint.vehicle.registrationNumber : 'Unknown Vehicle';
      if (diffDays < 0) {
        message = `Vehicle ${regNo}: Maintenance overdue by ${Math.abs(diffDays)} days`;
      } else if (diffDays === 0) {
        message = `Vehicle ${regNo}: Maintenance Due Today`;
      } else {
        message = `Vehicle ${regNo}: Maintenance Due in ${diffDays} days`;
      }
      alerts.push({ id: `maint-${maint._id}`, type: 'danger', message });
    });

    // 3. Vehicles in Shop
    if (vehiclesInShop > 0) {
      alerts.push({ id: 'vehicles-in-shop', type: 'info', message: `${vehiclesInShop} Vehicle${vehiclesInShop > 1 ? 's' : ''} currently In Shop` });
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
      filteredVehicleCount,
      alerts
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardKPIs
};
