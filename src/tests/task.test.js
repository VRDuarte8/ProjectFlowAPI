const request = require('supertest');
const app = require('../app');
const { getAuthToken } = require('./helpers/auth');

describe('Tasks Authorization', () => {
  it('Should return 403 if user is not member of project', async () => {
    const tokenOwner = await getAuthToken();
    const tokenOther = await getAuthToken();

    const project = await request(app)
          .post('/api/projects/create')
          .set('Authorization', `Bearer ${tokenOwner}`)
          .send({
            name: `Projeto ${Date.now()}_${Math.random()}`,
            description: 'Teste',
        });

    const res = await request(app)
      .post('/api/tasks/create')
      .set('Authorization', `Bearer ${tokenOther}`)
      .send({
        title: 'Task inválida',
        project: project.body._id,
      });

    expect(res.status).toBe(403);
  });
});
