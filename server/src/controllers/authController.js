const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Email' });
    }
    
    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Account Disabled' });
    }

    if (await user.matchPassword(password)) {
      user.lastLogin = Date.now();
      await user.save();

      res.json({
        success: true,
        token: generateToken(user._id, user.role, user.email),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect Password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin (Fleet Manager)
const register = async (req, res) => {
  const { name, email, phone, employeeId, department, role, password, status } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }, { employeeId }] });

    if (userExists) {
      let duplicateField = 'User';
      if (userExists.email === email) duplicateField = 'Email';
      else if (userExists.phone === phone) duplicateField = 'Phone';
      else if (userExists.employeeId === employeeId) duplicateField = 'Employee ID';
      
      return res.status(400).json({ success: false, message: `${duplicateField} already exists` });
    }

    const user = await User.create({
      name,
      email,
      phone,
      employeeId,
      department,
      role,
      password,
      status: status || 'Active'
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "User Created Successfully"
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = { login, register };
