const { describe, it, request, expect } = require('supertest');
const app = require('../app');

describe('Auth', () => {
  it('Should register and login a user', async () => {
    await request(app)
      .post('/users/register')
      .send({ name: 'Test user', email: 'test@email.com', password: '123456' })
      .expect(201);

    const login = await request(app)
      .post('/users/login')
      .send({ email: 'test@email.com', password: '123456' })
      .expect(200);

    expect(login.body).toHaveProperty('token');
  });
});
