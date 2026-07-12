const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');

const getDashboardKPIs = async () => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    
    // activeVehicles: status != Retired
    const activeVehicles = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });
    
    // availableVehicles: status == Available
    const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
    
    // vehiclesInShop: status == In Shop
    const vehiclesInShop = await Vehicle.countDocuments({ status: 'In Shop' });
    
    // activeTrips: status == Dispatched
    const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
    
    // pendingTrips: status == Draft
    const pendingTrips = await Trip.countDocuments({ status: 'Draft' });
    
    // driversOnDuty: Available + On Trip
    const driversOnDuty = await Driver.countDocuments({ status: { $in: ['Available', 'On Trip'] } });
    
    // fleetUtilization: On Trip Vehicles / Total Active Vehicles * 100
    const onTripVehicles = await Vehicle.countDocuments({ status: 'On Trip' });
    
    let fleetUtilization = 0;
    if (activeVehicles > 0) {
      fleetUtilization = Math.round((onTripVehicles / activeVehicles) * 100);
    }

    return {
      activeVehicles,
      availableVehicles,
      vehiclesInShop,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardKPIs
};
