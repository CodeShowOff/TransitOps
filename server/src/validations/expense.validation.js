const validateExpense = (data) => {
  const errors = {};

  if (!data.vehicle) {
    errors.vehicle = 'Vehicle is required';
  }

  const validCategories = ['Toll', 'Maintenance', 'Parking', 'Repair', 'Other'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = 'Valid Category is required';
  }

  if (data.amount === undefined || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.amount = 'Amount must be a number greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = { validateExpense };
