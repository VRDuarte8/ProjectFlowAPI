const { describe, it, request, expect } = require('supertest');
const app = require('../app');

describe('Tasks Authorization', () => {
  it('Should return 403 if user is not member of project', async () => {
    const res = await request(app)
      .post('/tasks/create')
      .set('Authorization', `Bearer token_invalido`)
      .send({
        title: 'Task inválida',
        projectId: 'fakeProjectId',
      });

    expect(res.status).toBe(403);
  });
});
