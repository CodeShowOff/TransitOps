const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    category: {
      type: String,
      enum: ['Toll', 'Maintenance', 'Parking', 'Repair', 'Other'],
      required: true
    },
    description: String,
    amount: {
      type: Number,
      required: true
    },
    expenseDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
