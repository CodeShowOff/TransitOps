const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      unique: true,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true
    },
    cargoWeight: {
      type: Number,
      required: true
    },
    plannedDistance: {
      type: Number,
      required: true
    },
    actualDistance: {
      type: Number
    },
    fuelConsumed: {
      type: Number
    },
    revenue: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Draft'
    },
    dispatchDate: Date,
    completedDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to auto-generate tripNumber if not provided
tripSchema.pre('validate', function(next) {
  if (!this.tripNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.tripNumber = `TRP-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
