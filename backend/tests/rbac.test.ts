import request from 'supertest';
import app from '../src/app';
import { signToken } from '../src/utils/jwt';

describe('Role-based access control', () => {
  it('rejects unauthenticated requests to protected routes', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
  });

  it('rejects a Team Member creating a project (Admin/PM only)', async () => {
    const token = signToken({ sub: 'fake-user-id', role: 'TEAM_MEMBER', email: 'member@example.com' });
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Should not be allowed' });

    expect(res.status).toBe(403);
  });

  it('rejects a Team Member creating a user (Admin only)', async () => {
    const token = signToken({ sub: 'fake-user-id', role: 'TEAM_MEMBER', email: 'member@example.com' });
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New', email: 'new@example.com', password: 'longenoughpassword' });

    expect(res.status).toBe(403);
  });

  it('rejects requests with a malformed token', async () => {
    const res = await request(app).get('/api/projects').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
