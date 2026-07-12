require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// Import models
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Driver = require('../src/models/Driver');
const Trip = require('../src/models/Trip');
const Expense = require('../src/models/Expense');
const FuelLog = require('../src/models/FuelLog');
const Maintenance = require('../src/models/Maintenance');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transitops');
    console.log('MongoDB Connected');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Vehicle.deleteMany(),
      Driver.deleteMany(),
      Trip.deleteMany(),
      Expense.deleteMany(),
      FuelLog.deleteMany(),
      Maintenance.deleteMany()
    ]);
    console.log('Existing data cleared');

    // 1. Seed Users
    const usersData = [
      {
        name: 'Ravi Kumar', email: 'fleet@transitops.com', phone: '9000000001', employeeId: 'EMP001',
        department: 'Management', role: 'Fleet Manager', password: 'Fleet@123', status: 'Active'
      },
      {
        name: 'Alex Johnson', email: 'dispatch@transitops.com', phone: '9000000002', employeeId: 'EMP002',
        department: 'Operations', role: 'Dispatcher', password: 'Dispatch@123', status: 'Active'
      },
      {
        name: 'Priya Sharma', email: 'safety@transitops.com', phone: '9000000003', employeeId: 'EMP003',
        department: 'Safety', role: 'Safety Officer', password: 'Safety@123', status: 'Active'
      },
      {
        name: 'John Davis', email: 'finance@transitops.com', phone: '9000000004', employeeId: 'EMP004',
        department: 'Finance', role: 'Financial Analyst', password: 'Finance@123', status: 'Active'
      }
    ];

    const users = [];
    for (const u of usersData) {
      users.push(await User.create(u));
    }
    console.log('Users seeded');

    // 2. Seed Vehicles
    const vehiclesData = [
      { registrationNumber: 'KA-01-AB-1234', model: 'Tata Ace', type: 'Mini Truck', maxLoadCapacity: 750, odometer: 15200, acquisitionCost: 500000, region: 'South', status: 'Available' },
      { registrationNumber: 'MH-12-CD-5678', model: 'Ashok Leyland Dost', type: 'Pickup', maxLoadCapacity: 1250, odometer: 42000, acquisitionCost: 750000, region: 'West', status: 'On Trip' },
      { registrationNumber: 'DL-04-EF-9012', model: 'Mahindra Bolero Pik-Up', type: 'Pickup', maxLoadCapacity: 1500, odometer: 68500, acquisitionCost: 850000, region: 'North', status: 'Available' },
      { registrationNumber: 'TN-09-GH-3456', model: 'Tata 407', type: 'Truck', maxLoadCapacity: 2500, odometer: 110000, acquisitionCost: 1200000, region: 'South', status: 'In Shop' },
      { registrationNumber: 'GJ-01-IJ-7890', model: 'Eicher Pro 2049', type: 'Truck', maxLoadCapacity: 4900, odometer: 8500, acquisitionCost: 1500000, region: 'West', status: 'Available' }
    ];
    const vehicles = await Vehicle.insertMany(vehiclesData);
    console.log('Vehicles seeded');

    // 3. Seed Drivers
    const driversData = [
      { name: 'Ramesh Singh', employeeId: 'DRV001', licenseNumber: 'DL-1234567890123', licenseCategory: 'Transport', licenseExpiry: new Date('2028-05-15'), phone: '9876543210', email: 'ramesh@example.com', address: 'Delhi', joiningDate: new Date('2022-01-10'), safetyScore: 95, status: 'Available', isActive: true },
      { name: 'Suresh Patel', employeeId: 'DRV002', licenseNumber: 'GJ-9876543210987', licenseCategory: 'HMV', licenseExpiry: new Date('2027-11-20'), phone: '8765432109', email: 'suresh@example.com', address: 'Ahmedabad', joiningDate: new Date('2021-08-22'), safetyScore: 88, status: 'On Trip', isActive: true },
      { name: 'Muthu Kumar', employeeId: 'DRV003', licenseNumber: 'TN-5678901234567', licenseCategory: 'Transport', licenseExpiry: new Date('2026-03-10'), phone: '7654321098', email: 'muthu@example.com', address: 'Chennai', joiningDate: new Date('2023-05-05'), safetyScore: 100, status: 'Available', isActive: true },
      { name: 'Abdul Rahman', employeeId: 'DRV004', licenseNumber: 'MH-2345678901234', licenseCategory: 'LMV', licenseExpiry: new Date('2029-01-25'), phone: '6543210987', email: 'abdul@example.com', address: 'Mumbai', joiningDate: new Date('2020-12-15'), safetyScore: 92, status: 'Off Duty', isActive: true }
    ];
    const drivers = await Driver.insertMany(driversData);
    console.log('Drivers seeded');

    // 4. Seed Trips
    const tripsData = [
      { 
        source: 'Mumbai', destination: 'Pune', vehicle: vehicles[1]._id, driver: drivers[1]._id, 
        cargoWeight: 1000, plannedDistance: 150, actualDistance: 155, fuelConsumed: 15, revenue: 5000, 
        status: 'Completed', dispatchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
        createdBy: users[1]._id 
      },
      { 
        source: 'Delhi', destination: 'Chandigarh', vehicle: vehicles[2]._id, driver: drivers[0]._id, 
        cargoWeight: 1200, plannedDistance: 250, revenue: 8000, 
        status: 'Dispatched', dispatchDate: new Date(), 
        createdBy: users[1]._id 
      },
      { 
        source: 'Chennai', destination: 'Bangalore', vehicle: vehicles[0]._id, driver: drivers[2]._id, 
        cargoWeight: 500, plannedDistance: 350, revenue: 12000, 
        status: 'Draft', 
        createdBy: users[1]._id 
      },
      { 
        source: 'Ahmedabad', destination: 'Surat', vehicle: vehicles[4]._id, driver: drivers[1]._id, 
        cargoWeight: 4500, plannedDistance: 270, actualDistance: 275, fuelConsumed: 40, revenue: 15000, 
        status: 'Completed', dispatchDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), completedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), 
        createdBy: users[1]._id 
      }
    ];
    const trips = [];
    for (const t of tripsData) {
        trips.push(await Trip.create(t));
    }
    console.log('Trips seeded');

    // 5. Seed Expenses
    const expensesData = [
      { vehicle: vehicles[1]._id, trip: trips[0]._id, category: 'Toll', description: 'Mumbai-Pune Expressway Toll', amount: 320, expenseDate: trips[0].dispatchDate },
      { vehicle: vehicles[1]._id, trip: trips[0]._id, category: 'Parking', description: 'Parking at Pune delivery hub', amount: 150, expenseDate: trips[0].completedDate },
      { vehicle: vehicles[4]._id, trip: trips[3]._id, category: 'Toll', description: 'NE1 Expressway Toll', amount: 450, expenseDate: trips[3].dispatchDate },
      { vehicle: vehicles[3]._id, category: 'Repair', description: 'Brake pad replacement', amount: 2500, expenseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      // Auto-created expense for completed maintenance
      { vehicle: vehicles[0]._id, category: 'Maintenance', description: 'Maintenance: Oil Change at Local Garage', amount: 2200, expenseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
    ];
    await Expense.insertMany(expensesData);
    console.log('Expenses seeded');

    // 6. Seed FuelLogs
    const fuelLogsData = [
      { vehicle: vehicles[1]._id, trip: trips[0]._id, liters: 30, fuelPrice: 95.5, cost: 30 * 95.5, odometer: 41845, filledDate: trips[0].dispatchDate, filledBy: users[0]._id },
      { vehicle: vehicles[4]._id, trip: trips[3]._id, liters: 80, fuelPrice: 94.2, cost: 80 * 94.2, odometer: 8225, filledDate: trips[3].dispatchDate, filledBy: users[0]._id },
      { vehicle: vehicles[2]._id, liters: 45, fuelPrice: 96.0, cost: 45 * 96.0, odometer: 68400, filledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), filledBy: users[0]._id }
    ];
    await FuelLog.insertMany(fuelLogsData);
    console.log('FuelLogs seeded');

    // 7. Seed Maintenance
    const maintenanceData = [
      { vehicle: vehicles[3]._id, serviceType: 'Engine Overhaul', description: 'Routine 100k km engine check and parts replacement', workshop: 'Tata Motors Authorized Service Center', scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), estimatedCost: 15000, status: 'Active', createdBy: users[2]._id },
      { vehicle: vehicles[0]._id, serviceType: 'Oil Change', description: 'Regular oil and filter change', workshop: 'Local Garage', scheduledDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), completedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), estimatedCost: 2000, actualCost: 2200, status: 'Completed', createdBy: users[2]._id }
    ];
    await Maintenance.insertMany(maintenanceData);
    console.log('Maintenance seeded');

    console.log('All mock data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
