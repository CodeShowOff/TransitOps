const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth Endpoints', () => {
  let fleetManagerToken;
  let testUser;

  beforeEach(async () => {
    // Create a Fleet Manager
    testUser = await User.create({
      name: 'Manager',
      email: 'manager@test.com',
      phone: '1234567890',
      employeeId: 'EMP001',
      department: 'Management',
      role: 'Fleet Manager',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'manager@test.com', password: 'password123' });
    fleetManagerToken = res.body.token;
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'manager@test.com', password: 'password123' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'manager@test.com', password: 'wrongpassword' });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Incorrect Password');
    });

    it('should fail with inactive account', async () => {
      await User.findByIdAndUpdate(testUser._id, { status: 'Inactive' });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'manager@test.com', password: 'password123' });
      
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Account Disabled');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user when authorized as Fleet Manager', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          name: 'Dispatcher John',
          email: 'john@test.com',
          phone: '0987654321',
          employeeId: 'EMP002',
          department: 'Dispatch',
          role: 'Dispatcher',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User Created Successfully');
    });

    it('should not register if email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          name: 'Manager Clone',
          email: 'manager@test.com', // Duplicate email
          phone: '1111111111',
          employeeId: 'EMP003',
          department: 'Management',
          role: 'Dispatcher',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already exists');
    });

    it('should fail if not authorized (no token)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Hacker',
          email: 'hacker@test.com',
          phone: '9999999999',
          employeeId: 'EMP999',
          department: 'Unknown',
          role: 'Dispatcher',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(401);
    });
  });
});
