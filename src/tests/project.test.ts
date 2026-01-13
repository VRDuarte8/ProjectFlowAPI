const { beforeAll, describe, it, request, expect } = require('supertest');
const app = require('../app');

let token: string;

beforeAll(async () => {
  const res = await request(app).post('/users/login').send({
    email: 'test@email.com',
    password: '123456',
  });
  token = res.body.token;
});

describe('Projects', () => {
  it('should create a project with token', async () => {
    const res = await request(app)
      .post('/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Projeto Teste',
        description: 'Teste',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });
});
