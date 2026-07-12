const validateVehicle = (data) => {
  const errors = {};

  if (!data.registrationNumber || typeof data.registrationNumber !== 'string') {
    errors.registrationNumber = 'Registration Number is required and must be a string';
  } else if (!/^[A-Z0-9- ]+$/i.test(data.registrationNumber)) {
    // Optional: Add regex for more strict registration number validation if needed
    // The schema takes care of uppercase and trim, but we validate basic presence
  }

  if (!data.model || typeof data.model !== 'string') {
    errors.model = 'Model is required';
  }

  if (!data.maxLoadCapacity || typeof data.maxLoadCapacity !== 'number' || data.maxLoadCapacity <= 0) {
    errors.maxLoadCapacity = 'Maximum Capacity is required and must be greater than 0';
  }

  if (!data.acquisitionCost || typeof data.acquisitionCost !== 'number' || data.acquisitionCost <= 0) {
    errors.acquisitionCost = 'Acquisition Cost is required and must be greater than 0';
  }

  if (data.odometer !== undefined) {
    if (typeof data.odometer !== 'number' || data.odometer < 0) {
      errors.odometer = 'Odometer must be a non-negative number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = { validateVehicle };
