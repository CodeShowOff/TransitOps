const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin (Fleet Manager)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
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
        message: "User Created Successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, department, role, status } = req.body;
    
    if (phone && phone !== user.phone) {
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ success: false, message: 'Phone number already exists' });
        }
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.department = department || user.department;
    user.role = role || user.role;
    
    if (req.user.id !== req.params.id && status) {
        user.status = status;
    }

    const updatedUser = await user.save();
    
    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    res.json({ success: true, data: userToReturn });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = req.body.status;
    const updatedUser = await user.save();

    res.json({ success: true, data: { _id: updatedUser._id, status: updatedUser.status } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus
};
