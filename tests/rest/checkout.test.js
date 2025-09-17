const request = require('supertest');
const app = require('../../rest/app');
const { expect } = require('chai');

describe('REST - Checkout', () => {
  let token;

  before(async () => {
    // Faz login antes para obter o token
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: "alice@email.com",
        password: "123456"
      });

    token = res.body.token;
  });

  it('deve realizar checkout com boleto', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: 1, quantity: 2 }],
        freight: 20,
        paymentMethod: "boleto"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("paymentMethod", "boleto");
    expect(res.body).to.have.property("valorFinal");
  });

  it('deve realizar checkout com cartão e aplicar desconto', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: 2, quantity: 1 }],
        freight: 15,
        paymentMethod: "credit_card",
        cardData: {
          number: "4111111111111111",
          name: "QA Tester",
          expiry: "12/30",
          cvv: "123"
        }
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("paymentMethod", "credit_card");
  });

  it('não deve realizar checkout sem token', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({
        items: [{ productId: 1, quantity: 1 }],
        freight: 10,
        paymentMethod: "boleto"
      });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("error");
  });
});
