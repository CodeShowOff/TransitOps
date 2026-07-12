const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

/**
 * Validates a trip before dispatch.
 * Throws an error if any business rule fails.
 */
const validateTripForDispatch = async (trip) => {
  // Rule 7: Trip can only dispatch from Draft
  if (trip.status !== 'Draft') {
    throw new Error('Trip can only be dispatched from Draft status.');
  }

  // Load Vehicle and Driver
  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  // Rule 1: Vehicle must exist
  if (!vehicle) {
    throw new Error('Assigned vehicle does not exist.');
  }

  // Rule 2: Driver must exist
  if (!driver) {
    throw new Error('Assigned driver does not exist.');
  }

  // Rule 3: Vehicle must be Available
  if (vehicle.status !== 'Available') {
    throw new Error(`Vehicle is not available (Current Status: ${vehicle.status}).`);
  }

  // Rule 4: Driver must be Available
  if (driver.status !== 'Available') {
    throw new Error(`Driver is not available (Current Status: ${driver.status}).`);
  }

  // Rule 5: License must not expire
  const today = new Date();
  if (new Date(driver.licenseExpiry) < today) {
    throw new Error('Driver license has expired.');
  }

  // Rule 6: Cargo Weight <= Vehicle Capacity
  if (trip.cargoWeight > vehicle.maxLoadCapacity) {
    throw new Error(`Cargo weight (${trip.cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg).`);
  }

  return { vehicle, driver };
};

module.exports = {
  validateTripForDispatch
};
