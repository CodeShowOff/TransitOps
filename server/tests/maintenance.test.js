const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Maintenance = require('../src/models/Maintenance');

describe('Maintenance Endpoints & Business Logic', () => {
  let fleetManagerToken;
  let vehicle;
  let maintenance;

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
      registrationNumber: 'TRK-MAINT',
      model: 'Volvo VNL',
      type: 'Truck',
      maxLoadCapacity: 15000,
      acquisitionCost: 100000,
      status: 'Available'
    });
  });

  describe('Create Maintenance', () => {
    it('should create maintenance and set vehicle to In Shop', async () => {
      const res = await request(app)
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          vehicle: vehicle._id,
          serviceType: 'Oil Change',
          scheduledDate: new Date(),
          estimatedCost: 500
        });

      expect(res.statusCode).toBe(201);
      
      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.status).toBe('In Shop');
    });

    it('should not create if vehicle already has active maintenance', async () => {
      // First active maintenance
      await Maintenance.create({
        vehicle: vehicle._id,
        serviceType: 'Oil Change',
        scheduledDate: new Date(),
        status: 'Active'
      });

      const res = await request(app)
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          vehicle: vehicle._id,
          serviceType: 'Tire Replacement',
          scheduledDate: new Date(),
          estimatedCost: 1000
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Vehicle already has an active maintenance record');
    });
  });

  describe('Complete Maintenance', () => {
    it('should complete maintenance and set vehicle back to Available', async () => {
      vehicle.status = 'In Shop';
      await vehicle.save();

      maintenance = await Maintenance.create({
        vehicle: vehicle._id,
        serviceType: 'Oil Change',
        scheduledDate: new Date(),
        status: 'Active'
      });

      const res = await request(app)
        .patch(`/api/maintenance/${maintenance._id}/complete`)
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          actualCost: 600
        });

      expect(res.statusCode).toBe(200);

      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.status).toBe('Available');
      
      const updatedMaintenance = await Maintenance.findById(maintenance._id);
      expect(updatedMaintenance.status).toBe('Completed');
    });
  });
});
