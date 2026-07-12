const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Driver = require('../src/models/Driver');
const Trip = require('../src/models/Trip');
const FuelLog = require('../src/models/FuelLog');
const Maintenance = require('../src/models/Maintenance');
const Expense = require('../src/models/Expense');

describe('End-to-End Business Flow & Financial Accuracy', () => {
  let fleetManagerToken;
  let vehicleId;
  let driverId;
  let tripId;
  let maintenanceId;

  beforeEach(async () => {
    // 1. Setup Admin User (Fleet Manager)
    await User.create({
      name: 'Manager',
      email: 'manager@test.com',
      phone: '1234567890',
      employeeId: 'EMP-001',
      department: 'Management',
      role: 'Fleet Manager',
      password: 'password123',
    });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'manager@test.com', password: 'password123' });
    fleetManagerToken = res.body.token;
  });

  it('should execute the full end-to-end business flow successfully', async () => {
    // Step 1: Fleet Manager creates a new Vehicle
    let res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${fleetManagerToken}`)
      .send({
        registrationNumber: 'E2E-TRK-01',
        model: 'Volvo VNL 860',
        type: 'Truck',
        maxLoadCapacity: 20000,
        acquisitionCost: 150000
      });
    
    expect(res.statusCode).toBe(201);
    vehicleId = res.body.vehicle._id;

    // Step 2: Fleet Manager creates a new Driver
    res = await request(app)
      .post('/api/drivers')
      .set('Authorization', `Bearer ${fleetManagerToken}`)
      .send({
        name: 'John Doe',
        employeeId: 'E2E-DRV-01',
        licenseNumber: 'LIC-E2E-123',
        licenseCategory: 'HMV',
        licenseExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days future
        phone: '9998887776'
      });
    
    expect(res.statusCode).toBe(201);
    driverId = res.body.data._id;

    // Step 3: Create a Draft Trip
    res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${fleetManagerToken}`)
      .send({
        source: 'New York',
        destination: 'Boston',
        vehicle: vehicleId,
        driver: driverId,
        cargoWeight: 15000,
        plannedDistance: 350,
        revenue: 2000 // Expected revenue
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.data.status).toBe('Draft');
    tripId = res.body.data._id;

    // Step 4: Dispatch the Trip (State Transitions)
    res = await request(app)
      .patch(`/api/trips/${tripId}/dispatch`)
      .set('Authorization', `Bearer ${fleetManagerToken}`);
    
    expect(res.statusCode).toBe(200);
    
    // Verify Vehicle & Driver statuses are "On Trip"
    let vehicle = await Vehicle.findById(vehicleId);
    let driver = await Driver.findById(driverId);
    
    expect(vehicle.status).toBe('On Trip');
    expect(driver.status).toBe('On Trip');

    // Step 5: Complete the Trip & Auto-generate Fuel Log
    const actualDistance = 360;
    const fuelConsumed = 50; // Liters
    const fuelPrice = 4; // Cost per liter ($200 total)

    res = await request(app)
      .patch(`/api/trips/${tripId}/complete`)
      .set('Authorization', `Bearer ${fleetManagerToken}`)
      .send({
        actualDistance,
        fuelConsumed,
        fuelPrice
      });
    
    expect(res.statusCode).toBe(200);

    // Verify statuses are freed
    vehicle = await Vehicle.findById(vehicleId);
    driver = await Driver.findById(driverId);
    expect(vehicle.status).toBe('Available');
    expect(driver.status).toBe('Available');
    
    // Verify odometer updated
    expect(vehicle.odometer).toBe(actualDistance);

    // Verify Fuel Log is auto-created with accurate costs
    const fuelLog = await FuelLog.findOne({ trip: tripId });
    expect(fuelLog).toBeDefined();
    expect(fuelLog.cost).toBe(fuelConsumed * fuelPrice); // 50 * 4 = 200

    // Step 6: Create active Maintenance (Vehicle goes In Shop)
    res = await request(app)
      .post('/api/maintenance')
      .set('Authorization', `Bearer ${fleetManagerToken}`)
      .send({
        vehicle: vehicleId,
        serviceType: 'Routine Inspection',
        workshop: 'City Garage',
        scheduledDate: new Date(),
        estimatedCost: 150
      });
    
    expect(res.statusCode).toBe(201);
    maintenanceId = res.body.maintenance._id;

    vehicle = await Vehicle.findById(vehicleId);
    expect(vehicle.status).toBe('In Shop');

    // Step 7: Complete Maintenance & Auto-generate Expense
    const actualCost = 180; // Final cost for maintenance

    res = await request(app)
      .patch(`/api/maintenance/${maintenanceId}/complete`)
      .set('Authorization', `Bearer ${fleetManagerToken}`)
      .send({
        actualCost
      });
    
    expect(res.statusCode).toBe(200);

    // Vehicle becomes Available
    vehicle = await Vehicle.findById(vehicleId);
    expect(vehicle.status).toBe('Available');

    // Expense is auto-created
    const expense = await Expense.findOne({ vehicle: vehicleId, category: 'Maintenance' });
    expect(expense).toBeDefined();
    expect(expense.amount).toBe(actualCost);
    expect(expense.description).toContain('Routine Inspection');

    // Step 8: Verify Expenses API returns accurate total costs
    res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${fleetManagerToken}`);
    
    expect(res.statusCode).toBe(200);
    const expenses = res.body.data;
    const maintenanceExpense = expenses.find(e => e.amount === 180 && e.category === 'Maintenance');
    expect(maintenanceExpense).toBeDefined();
  });
});
