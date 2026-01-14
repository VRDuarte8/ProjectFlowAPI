const request = require('supertest');
const app = require('../app');
const {getAuthToken} = require('./helpers/auth')

describe('Projects', () => {
  it('should create a project with token', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Projeto Teste',
        description: 'Teste',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });
});
