import { group, check } from 'k6';
import { Trend } from 'k6/metrics';

import { login } from '../helpers/auth.helper.js';
import { checkout } from '../helpers/checkout.helper.js';
import { checkoutData } from '../data/checkout.data.js';
import { stages } from '../config/stages.js';

// 🔹 Relatório HTML
import { htmlReport } from '../helpers/html-report.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// 🔹 Trend (métrica customizada)
export const checkoutDuration = new Trend('checkout_duration');

// 🔹 Configurações do teste
export const options = {
  stages,
  thresholds: {
    checkout_duration: ['p(95)<1000'], // 95% das requisições abaixo de 1s
    http_req_failed: ['rate<0.05'],    // menos de 5% de erro
  },
};

// 🔹 Variável de ambiente
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// 🔹 Helper simples para gerar e-mail único
function generateEmail() {
  const timestamp = Date.now();
  return `user_${timestamp}@test.com`;
}

// 🔹 Fluxo principal do teste
export default function () {
  group('Autenticação', () => {
    const email = generateEmail();
    const password = 'senha123';

    const token = login(BASE_URL, email, password);

    check(token, {
      'Token JWT gerado com sucesso': (t) => t !== null && t !== undefined,
    });

    group('Checkout', () => {
      // 🔹 Data-driven testing
      const payload =
        checkoutData[Math.floor(Math.random() * checkoutData.length)];

      const res = checkout(BASE_URL, token, payload);

      // 🔹 Checks
      check(res, {
        'Status do checkout é 200': (r) => r.status === 200,
        'Valor final retornado': (r) => r.json('valorFinal') !== null,
      });

      // 🔹 Trend
      checkoutDuration.add(res.timings.duration);
    });
  });
}

// 🔹 Geração do relatório HTML
export function handleSummary(data) {
  return {
    'tests/k6/reports/k6-report.html': htmlReport(data),
    stdout: textSummary(data),
  };
}
