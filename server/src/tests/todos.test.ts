// Jest and supertest

const request = require('supertest');
const app = require('../index');

describe('Todo API', () => {
  it('should return an empty array initially', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

});
