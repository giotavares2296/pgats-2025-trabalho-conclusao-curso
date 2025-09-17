const request = require('supertest');
const app = require('../../graphql/app');
const { expect } = require('chai');

describe('GraphQL - Users', () => {
  it('deve listar usuários cadastrados', async () => {
    const query = `
      query Users {
        users {
          email
          name
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query });

    expect(res.status).to.equal(200);
    expect(res.body.data.users).to.be.an("array");
    expect(res.body.data.users[0]).to.have.property("email");
  });
});
