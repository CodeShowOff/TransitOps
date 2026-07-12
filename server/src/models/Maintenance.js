const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    serviceType: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    workshop: {
      type: String
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    completedDate: {
      type: Date
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    actualCost: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
