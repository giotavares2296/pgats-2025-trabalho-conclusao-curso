const request = require('supertest');
const app = require('../../rest/app');
const { expect } = require('chai');

describe('REST - Login', () => {
  it('deve fazer login com credenciais válidas e retornar token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: "alice@email.com",
        password: "123456"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it('não deve logar com senha inválida', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: "alice@email.com",
        password: "senha_errada"
      });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("error");
  });
});
