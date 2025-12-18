export const checkoutData = [
  {
    items: [{ productId: 1, quantity: 2 }],
    freight: 10,
    paymentMethod: 'boleto'
  },
  {
    items: [{ productId: 2, quantity: 1 }],
    freight: 15,
    paymentMethod: 'credit_card',
    cardData: {
      number: '4111111111111111',
      name: 'Teste Performance',
      expiry: '12/30',
      cvv: '123'
    }
  }
];
