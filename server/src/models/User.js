const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "Fleet Manager",
      "Dispatcher",
      "Safety Officer",
      "Financial Analyst"
    ],
    required: true
  },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  lastLogin: Date
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
