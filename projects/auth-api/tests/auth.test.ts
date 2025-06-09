import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createServer } from '../src/server';
import { User } from '../src/models/user.model';
import mongoose from 'mongoose';

const app = createServer();

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
    await User.create({ email: 'test@test.com', passwordHash: '12345678' });

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
});
