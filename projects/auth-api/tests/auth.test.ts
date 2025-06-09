import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createServer } from '../src/server';
import { User } from '../src/models/user.model';
import mongoose from 'mongoose';
import { hashPassword } from '../src/utils/hash';

const app = createServer();

const createTestUser = async (email: string, password: string, overrides = {}) => {
  const passwordHash = await hashPassword(password);
  await User.create({ email, passwordHash, ...overrides });
}

describe('Auth API', async () => {
  describe('Database unavailable', () => {
    afterEach(async () => {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI as string);
      }
    });

    it('should handle Mongo being completely unavailable', async () => {
      await mongoose.connection.close(); // simulate Mongo is down
    
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'mongo@fail.com', password: '12345678' });
    
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Something went wrong');
    });
  })

  describe('Register user', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: '12345678' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing fields');
    });
  
    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing fields');
    });
  
    it('should return 400 if password is less than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com', password: '1234567' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'Password must be at least 8 characters long'
      );
    });
  
    it('should return 409 if user already exists', async () => {
      await createTestUser('test@test.com', '12345678');
  
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com', password: '12345678' });
      
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('User already exists');
    });
  
    it('should return 201 if user is created', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@test.com', password: '12345678' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created');
    });
  
    it('should return 201 if user is created and have all fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@test.com', password: '12345678' });
      expect(res.status).toBe(201);
  
      const user = await User.findOne({ email: 'newuser@test.com' });
      expect(user?.email).toBe('newuser@test.com');
      expect(user?.passwordHash).toBeDefined();
      expect(user?.verified).toBe(false);
      expect(user?.signupSource).toBe('email');
      expect(user?.role).toBe('user');
      expect(user?.lastLogin).toBeNull();
      expect(user?.createdAt).toBeDefined();
      expect(user?.updatedAt).toBeDefined();
    })
  
    it('should return 500 if something goes wrong', async () => {
      vi.spyOn(User, 'create').mockRejectedValue(
        new Error('Database connection failed')
      );
  
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@test.com', password: '12345678' });
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Something went wrong');
  
      vi.restoreAllMocks();
    });
  })

  describe('Login user', () => {
    it('should return 400 if email is missing', async () => {
      await createTestUser('test@test.com', '12345678');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: '12345678' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing fields');
    });

    it('should return 400 if password is missing', async () => {
      await createTestUser('test@test.com', '12345678');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing fields');
    });

    it('should return 404 if user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '12345678' });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return 401 if password is incorrect', async () => {
      await createTestUser('test@test.com', '12345678');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '123456789' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 401 if user is not verified', async () => {
      await createTestUser('test@test.com', '12345678');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '12345678' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('User not verified');
    });

    it('should return 200 if user is logged in', async () => {
      await createTestUser('test@test.com', '12345678', { verified: true });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '12345678' });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User logged in');
      expect(res.body.userId).toBeDefined();
      expect(res.body.token).toBeDefined();
      expect(res.body.expiresIn).toBeDefined();
    });

    it('should return 200 if user is logged in and have all fields', async () => {
      await createTestUser('test@test.com', '12345678', { verified: true });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '12345678' });

      const user = await User.findOne({ email: 'test@test.com' });
      expect(user?.lastLogin).toBeDefined();
      expect(user?.lastLogin?.getTime()).toBeGreaterThan(Date.now() - 5000);
      expect(user?.lastLogin?.getTime()).toBeLessThan(Date.now() + 1000);
      
      expect(res.body.token).toBeDefined();
      expect(res.body.expiresIn).toBeDefined();
    });

    it('should return 500 if something goes wrong', async () => {
      vi.spyOn(User, 'findOne').mockRejectedValue(
        new Error('Database connection failed')
      );

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '12345678' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Something went wrong');

      vi.restoreAllMocks();
    });
  })
});
