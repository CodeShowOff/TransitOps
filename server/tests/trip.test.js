const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Driver = require('../src/models/Driver');
const Trip = require('../src/models/Trip');

describe('Trip Endpoints & Business Logic', () => {
  let fleetManagerToken;
  let vehicle;
  let driver;
  let trip;

  beforeEach(async () => {
    await User.create({
      name: 'Manager',
      email: 'manager@test.com',
      phone: '111',
      employeeId: 'E1',
      department: 'Mgmt',
      role: 'Fleet Manager',
      password: 'password123',
    });
    
    let res = await request(app).post('/api/auth/login').send({ email: 'manager@test.com', password: 'password123' });
    fleetManagerToken = res.body.token;

    vehicle = await Vehicle.create({
      registrationNumber: 'TRK-TRIP',
      model: 'Volvo VNL',
      type: 'Truck',
      maxLoadCapacity: 15000,
      acquisitionCost: 100000,
      status: 'Available'
    });

    driver = await Driver.create({
      name: 'Trip Driver',
      employeeId: 'DRV-TRIP',
      licenseNumber: 'LIC-TRIP',
      licenseCategory: 'HMV',
      licenseExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      phone: '1231231234',
      status: 'Available'
    });
  });

  describe('Dispatch Logic', () => {
    it('should fail if cargo weight exceeds capacity', async () => {
      trip = await Trip.create({
        source: 'A',
        destination: 'B',
        vehicle: vehicle._id,
        driver: driver._id,
        cargoWeight: 20000, // Exceeds 15000
        plannedDistance: 100
      });

      const res = await request(app)
        .patch(`/api/trips/${trip._id}/dispatch`)
        .set('Authorization', `Bearer ${fleetManagerToken}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/exceeds vehicle capacity/i);
    });

    it('should fail if vehicle is in shop', async () => {
      vehicle.status = 'In Shop';
      await vehicle.save();

      trip = await Trip.create({
        source: 'A',
        destination: 'B',
        vehicle: vehicle._id,
        driver: driver._id,
        cargoWeight: 10000,
        plannedDistance: 100
      });

      const res = await request(app)
        .patch(`/api/trips/${trip._id}/dispatch`)
        .set('Authorization', `Bearer ${fleetManagerToken}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Vehicle is not available/i);
    });

    it('should dispatch successfully and update vehicle/driver status', async () => {
      trip = await Trip.create({
        source: 'A',
        destination: 'B',
        vehicle: vehicle._id,
        driver: driver._id,
        cargoWeight: 10000,
        plannedDistance: 100
      });

      const res = await request(app)
        .patch(`/api/trips/${trip._id}/dispatch`)
        .set('Authorization', `Bearer ${fleetManagerToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Trip dispatched successfully');

      const updatedVehicle = await Vehicle.findById(vehicle._id);
      const updatedDriver = await Driver.findById(driver._id);
      expect(updatedVehicle.status).toBe('On Trip');
      expect(updatedDriver.status).toBe('On Trip');
    });
  });

  describe('Complete Logic', () => {
    it('should complete dispatched trip and free vehicle/driver', async () => {
      // Setup dispatched trip
      vehicle.status = 'On Trip';
      await vehicle.save();
      driver.status = 'On Trip';
      await driver.save();
      
      trip = await Trip.create({
        source: 'A',
        destination: 'B',
        vehicle: vehicle._id,
        driver: driver._id,
        cargoWeight: 10000,
        plannedDistance: 100,
        status: 'Dispatched'
      });

      const res = await request(app)
        .patch(`/api/trips/${trip._id}/complete`)
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          actualDistance: 110,
          fuelConsumed: 20,
          fuelPrice: 5
        });

      expect(res.statusCode).toBe(200);

      const updatedVehicle = await Vehicle.findById(vehicle._id);
      const updatedDriver = await Driver.findById(driver._id);
      expect(updatedVehicle.status).toBe('Available');
      expect(updatedDriver.status).toBe('Available');
    });
  });
});
