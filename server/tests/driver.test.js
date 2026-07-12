const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Driver = require('../src/models/Driver');

describe('Driver Endpoints', () => {
  let fleetManagerToken;
  let testDriver;

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

    testDriver = await Driver.create({
      name: 'John Doe',
      employeeId: 'DRV001',
      licenseNumber: 'LIC12345',
      licenseCategory: 'HMV',
      licenseExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      phone: '1234567890',
    });
  });

  describe('POST /api/drivers', () => {
    it('should create a driver if Fleet Manager', async () => {
      const res = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${fleetManagerToken}`)
        .send({
          name: 'Jane Doe',
          employeeId: 'DRV002',
          licenseNumber: 'LIC67890',
          licenseCategory: 'LMV',
          licenseExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          phone: '0987654321',
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employeeId).toBe('DRV002');
    });
  });

  describe('GET /api/drivers', () => {
    it('should get drivers', async () => {
      const res = await request(app)
        .get('/api/drivers')
        .set('Authorization', `Bearer ${fleetManagerToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
