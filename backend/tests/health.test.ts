import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('returns 200 and ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
