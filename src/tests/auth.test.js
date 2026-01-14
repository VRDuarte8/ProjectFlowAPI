const request = require('supertest');
const app = require('../app');
const {randomEmail} = require('./helpers/auth')

describe('Auth', () => {
  it('Should register and login a user', async () => {
    const email = randomEmail()
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Test user', email, password: '123456' })
      .expect(201);

    const login = await request(app)
      .post('/api/users/login')
      .send({ email, password: '123456' })
      .expect(200);

    expect(login.body).toHaveProperty('token');
  });
});
