const validateFuelLog = (data) => {
  const errors = {};

  if (!data.vehicle) {
    errors.vehicle = 'Vehicle is required';
  }

  if (data.liters === undefined || typeof data.liters !== 'number' || data.liters <= 0) {
    errors.liters = 'Liters must be a number greater than 0';
  }

  if (data.cost === undefined || typeof data.cost !== 'number' || data.cost <= 0) {
    errors.cost = 'Cost must be a number greater than 0';
  }

  if (data.odometer === undefined || typeof data.odometer !== 'number' || data.odometer < 0) {
    errors.odometer = 'Odometer must be a non-negative number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = { validateFuelLog };
