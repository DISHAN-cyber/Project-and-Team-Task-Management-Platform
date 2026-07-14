import request from 'supertest';
import app from '../src/app';

describe('POST /api/auth/register validation', () => {
  it('rejects a request with a short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('rejects a request with an invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'not-an-email', password: 'longenoughpassword' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login validation', () => {
  it('rejects a missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
  });
});
