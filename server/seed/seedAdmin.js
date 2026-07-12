require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transitops');
    
    // Clear existing users
    await User.deleteMany();

    const users = [
      {
        name: 'Ravi Kumar',
        email: 'fleet@transitops.com',
        phone: '9000000001',
        employeeId: 'EMP001',
        department: 'Management',
        role: 'Fleet Manager',
        password: 'Fleet@123',
        status: 'Active'
      },
      {
        name: 'Alex Johnson',
        email: 'dispatch@transitops.com',
        phone: '9000000002',
        employeeId: 'EMP002',
        department: 'Operations',
        role: 'Dispatcher',
        password: 'Dispatch@123',
        status: 'Active'
      },
      {
        name: 'Priya Sharma',
        email: 'safety@transitops.com',
        phone: '9000000003',
        employeeId: 'EMP003',
        department: 'Safety',
        role: 'Safety Officer',
        password: 'Safety@123',
        status: 'Active'
      },
      {
        name: 'John Davis',
        email: 'finance@transitops.com',
        phone: '9000000004',
        employeeId: 'EMP004',
        department: 'Finance',
        role: 'Financial Analyst',
        password: 'Finance@123',
        status: 'Active'
      }
    ];

    await User.insertMany(users);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedUsers();
