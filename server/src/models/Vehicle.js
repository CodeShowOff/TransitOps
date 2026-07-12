const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    model: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        "Truck",
        "Van",
        "Mini Truck",
        "Pickup"
      ]
    },
    maxLoadCapacity: {
      type: Number,
      required: true
    },
    odometer: {
      type: Number,
      default: 0
    },
    acquisitionCost: {
      type: Number,
      required: true
    },
    region: {
      type: String
    },
    status: {
      type: String,
      enum: [
        "Available",
        "On Trip",
        "In Shop",
        "Retired"
      ],
      default: "Available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
