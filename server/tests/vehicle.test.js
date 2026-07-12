const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');

describe('Vehicle Endpoints', () => {
  let fleetManagerToken;
  let dispatcherToken;
  let testVehicle;

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
    await User.create({
      name: 'Dispatcher',
      email: 'dispatcher@test.com',
      phone: '222',
      employeeId: 'E2',
      department: 'Disp',
      role: 'Dispatcher',
      password: 'password123',
    });
    
    let res = await request(app).post('/api/auth/login').send({ email: 'manager@test.com', password: 'password123' });
    fleetManagerToken = res.body.token;

    res = await request(app).post('/api/auth/login').send({ email: 'dispatcher@test.com', password: 'password123' });
    dispatcherToken = res.body.token;

    testVehicle = await Vehicle.create({
      registrationNumber: 'TRK-001',
      model: 'Volvo VNL',
      type: 'Truck',
      maxLoadCapacity: 15000,
      acquisitionCost: 100000,
    });
  });

  describe('POST /api/vehicles', () => {
    it('should create a vehicle if Fleet Manager', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          registrationNumber: 'TRK-002',
          model: 'Ford Transit',
          type: 'Van',
          maxLoadCapacity: 3000,
          acquisitionCost: 40000
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.vehicle.registrationNumber).toBe('TRK-002');
    });

    it('should not allow duplicate registration number', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          registrationNumber: 'TRK-001', // Already exists
          model: 'Volvo VNL',
          type: 'Truck',
          maxLoadCapacity: 15000,
          acquisitionCost: 100000
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Registration Number already exists');
    });

    it('should fail if unauthorized role (Dispatcher)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${dispatcherToken}`)
        .send({
          registrationNumber: 'TRK-003',
          model: 'Ford',
          type: 'Van',
          maxLoadCapacity: 3000,
          acquisitionCost: 40000
        });
      
      expect(res.statusCode).toBe(403); 
    });
  });

  describe('GET /api/vehicles', () => {
    it('should get vehicles', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${dispatcherToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].registrationNumber).toBe('TRK-001');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should mark a vehicle as Retired', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${testVehicle._id}`)
        .set('Authorization', `Bearer ${fleetManagerToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Vehicle marked as Retired');

      const updatedVehicle = await Vehicle.findById(testVehicle._id);
      expect(updatedVehicle.status).toBe('Retired');
    });
  });
});
