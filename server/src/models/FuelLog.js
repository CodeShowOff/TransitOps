const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    liters: {
      type: Number,
      required: true
    },
    cost: {
      type: Number, // Total cost in currency (e.g., ₹)
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FuelLog', fuelLogSchema);
