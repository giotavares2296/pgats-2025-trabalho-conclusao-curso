import http from 'k6/http';
import { check } from 'k6';

export function checkout(baseUrl, token, payload) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.post(
    `${baseUrl}/api/checkout`,
    JSON.stringify(payload),
    params
  );

  check(res, {
    'Checkout retornou 200': (r) => r.status === 200,
    'Campo valorFinal existe': (r) => r.json('valorFinal') !== null,
  });

  return res;
}
