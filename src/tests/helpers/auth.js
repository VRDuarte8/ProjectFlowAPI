const request = require('supertest');
const app = require('../../app');

function randomEmail() {
  return `test_${Date.now()}_${Math.random()}@email.com`;
}

async function getAuthToken() {
  const email = randomEmail();
  const password = '123456';

  await request(app).post('/api/users/register').send({
    name: 'Test User',
    email,
    password,
  });

  const login = await request(app).post('/api/users/login').send({
    email,
    password,
  });

  return login.body.token;
}

module.exports = { randomEmail, getAuthToken };
