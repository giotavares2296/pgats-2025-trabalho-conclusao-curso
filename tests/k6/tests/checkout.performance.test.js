import { group } from 'k6';
import { Trend } from 'k6/metrics';

import { login } from '../helpers/auth.helper.js';
import { checkout } from '../helpers/checkout.helper.js';
import { checkoutData } from '../data/checkout.data.js';
import { stages } from '../config/stages.js';

export const checkoutDuration = new Trend('checkout_duration');

export const options = {
  stages,
  thresholds: {
    checkout_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';7

function generateEmail() {
  const timestamp = Date.now();
  return `user_${timestamp}@test.com`;
}

export default function () {

  group('Autenticação', () => {
    const email = generateEmail();
    const password = 'senha123';

    const token = login(BASE_URL, email, password);

    group('Checkout', () => {
      const payload =
        checkoutData[Math.floor(Math.random() * checkoutData.length)];

      const res = checkout(BASE_URL, token, payload);

      checkoutDuration.add(res.timings.duration);
    });
  });
}
