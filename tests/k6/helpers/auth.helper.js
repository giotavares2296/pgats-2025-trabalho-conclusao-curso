import http from 'k6/http';
import { check } from 'k6';

export function login(baseUrl, email, password) {
  const payload = JSON.stringify({ email, password });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${baseUrl}/api/users/login`, payload, params);

  check(res, {
    'Login retornou 200': (r) => r.status === 200,
    'Token JWT retornado': (r) => r.json('token') !== undefined,
  });

  return res.json('token');
}
