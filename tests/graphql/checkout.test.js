const request = require('supertest');
const app = require('../../graphql/app');
const { expect } = require('chai');

describe('GraphQL - Checkout', () => {
  let token;

  before(async () => {
    const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;
    const variables = {
      email: "alice@email.com",
      password: "123456"
    };

    const res = await request(app)
      .post('/graphql')
      .send({ query: loginMutation, variables });

    token = res.body.data.login.token;
  });

  it('deve realizar checkout com boleto', async () => {
    const mutation = `
      mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!) {
        checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod) {
          valorFinal
          paymentMethod
        }
      }
    `;

    const variables = {
      items: [{ productId: 1, quantity: 2 }],
      freight: 20,
      paymentMethod: "boleto"
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutation, variables });

    expect(res.status).to.equal(200);
    expect(res.body.data.checkout).to.have.property("paymentMethod", "boleto");
  });

  it('deve realizar checkout com cartão de crédito e aplicar desconto', async () => {
    const mutation = `
      mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {
        checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {
          valorFinal
          paymentMethod
        }
      }
    `;

    const variables = {
      items: [{ productId: 2, quantity: 1 }],
      freight: 15,
      paymentMethod: "credit_card",
      cardData: {
        number: "4111111111111111",
        name: "QA Tester",
        expiry: "12/30",
        cvv: "123"
      }
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutation, variables });

    expect(res.status).to.equal(200);
    expect(res.body.data.checkout).to.have.property("paymentMethod", "credit_card");
  });
});
