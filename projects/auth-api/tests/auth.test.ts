import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createServer } from '../src/server';

const app = createServer();

describe('Auth API', async () => {
  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing fields');
  });
});
