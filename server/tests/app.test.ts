import request from 'supertest';
import app from '../src/index';

describe('GET /', () => {
  it('should return a message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});
