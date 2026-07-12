const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Trip = require('../src/models/Trip');

describe('Role-Based Access Control (RBAC) Verification', () => {
  let fleetManagerToken;
  let dispatcherToken;
  let safetyOfficerToken;
  let financialAnalystToken;
  
  let testVehicle;

  beforeEach(async () => {
    // 1. Setup Users for all 4 roles
    await User.create([
      { name: 'Manager', email: 'manager@test.com', phone: '1', employeeId: 'E1', department: 'Mgmt', role: 'Fleet Manager', password: 'password123' },
      { name: 'Dispatcher', email: 'dispatcher@test.com', phone: '2', employeeId: 'E2', department: 'Disp', role: 'Dispatcher', password: 'password123' },
      { name: 'Safety', email: 'safety@test.com', phone: '3', employeeId: 'E3', department: 'Safety', role: 'Safety Officer', password: 'password123' },
      { name: 'Finance', email: 'finance@test.com', phone: '4', employeeId: 'E4', department: 'Finance', role: 'Financial Analyst', password: 'password123' },
    ]);
    
    fleetManagerToken = (await request(app).post('/api/auth/login').send({ email: 'manager@test.com', password: 'password123' })).body.token;
    dispatcherToken = (await request(app).post('/api/auth/login').send({ email: 'dispatcher@test.com', password: 'password123' })).body.token;
    safetyOfficerToken = (await request(app).post('/api/auth/login').send({ email: 'safety@test.com', password: 'password123' })).body.token;
    financialAnalystToken = (await request(app).post('/api/auth/login').send({ email: 'finance@test.com', password: 'password123' })).body.token;

    // 2. Setup Dummy Data
    testVehicle = await Vehicle.create({
      registrationNumber: 'RBAC-01',
      model: 'Test',
      type: 'Van',
      maxLoadCapacity: 1000,
      acquisitionCost: 10000
    });
  });

  describe('No Authentication', () => {
    it('should return 401 when accessing protected route without a token', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Not authorized/i);
    });
  });

  describe('Dispatcher Role', () => {
    it('can read vehicles (GET /api/vehicles)', async () => {
      const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${dispatcherToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('cannot create vehicles (POST /api/vehicles)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${dispatcherToken}`)
        .send({ registrationNumber: 'BAD-01', model: 'Test', type: 'Van', maxLoadCapacity: 1000, acquisitionCost: 1000 });
      expect(res.statusCode).toBe(403);
    });

    it('cannot access expenses (GET /api/expenses)', async () => {
      const res = await request(app).get('/api/expenses').set('Authorization', `Bearer ${dispatcherToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('Safety Officer Role', () => {
    it('can read drivers (GET /api/drivers)', async () => {
      const res = await request(app).get('/api/drivers').set('Authorization', `Bearer ${safetyOfficerToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('cannot dispatch trips (PATCH /api/trips/:id/dispatch)', async () => {
      const res = await request(app)
        .patch('/api/trips/123/dispatch') // ID doesn't matter, auth should fail first
        .set('Authorization', `Bearer ${safetyOfficerToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('Financial Analyst Role', () => {
    it('can read expenses (GET /api/expenses)', async () => {
      const res = await request(app).get('/api/expenses').set('Authorization', `Bearer ${financialAnalystToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('cannot access vehicles (GET /api/vehicles)', async () => {
      const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${financialAnalystToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('cannot access trips (GET /api/trips)', async () => {
      const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${financialAnalystToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('Fleet Manager Role', () => {
    it('can access all routes (baseline)', async () => {
      const getVehicles = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${fleetManagerToken}`);
      const getDrivers = await request(app).get('/api/drivers').set('Authorization', `Bearer ${fleetManagerToken}`);
      const getTrips = await request(app).get('/api/trips').set('Authorization', `Bearer ${fleetManagerToken}`);
      const getExpenses = await request(app).get('/api/expenses').set('Authorization', `Bearer ${fleetManagerToken}`);
      
      expect(getVehicles.statusCode).toBe(200);
      expect(getDrivers.statusCode).toBe(200);
      expect(getTrips.statusCode).toBe(200);
      expect(getExpenses.statusCode).toBe(200);
    });
  });
});
