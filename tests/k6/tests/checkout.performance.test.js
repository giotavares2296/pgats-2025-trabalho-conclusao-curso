import { group, check } from 'k6';
import { Trend } from 'k6/metrics';

import { checkout } from '../helpers/checkout.helper.js';
import { checkoutData } from '../data/checkout.data.js';
import { stages } from '../config/stages.js';

import { htmlReport } from '../helpers/html-report.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const checkoutDuration = new Trend('checkout_duration');

export const options = {
  stages,
  thresholds: {
    checkout_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

// Variáveis de ambiente
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TOKEN = __ENV.TOKEN_JWT;

export default function () {
  group('Checkout autenticado', () => {
    const payload =
      checkoutData[Math.floor(Math.random() * checkoutData.length)];

    const res = checkout(BASE_URL, TOKEN, payload);

    check(res, {
      'Status é 200': (r) => r.status === 200,
      'valorFinal retornado': (r) => r.json('valorFinal') !== null,
    });

    checkoutDuration.add(res.timings.duration);
  });
}

// Relatório HTML
export function handleSummary(data) {
  return {
    'tests/k6/reports/k6-report.html': htmlReport(data),
    stdout: textSummary(data),
  };
}
