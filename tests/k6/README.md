# Testes de Performance com K6 – API Checkout (REST)

Este projeto contém testes automatizados de performance desenvolvidos com **K6**, aplicados sobre o endpoint de **Checkout da API REST** fornecida no curso.  
O objetivo é validar desempenho, estabilidade e regras de negócio do fluxo de checkout autenticado sob carga.

---

## 📁 Estrutura do Projeto

tests/k6/
├── config/
│ └── stages.js
├── data/
│ └── checkout-data.js
├── helpers/
│ ├── auth.helper.js
│ └── checkout.helper.js
├── reports/
│ ├── resultado.json
│ └── k6-report.html
├── tests/
│ └── checkout.performance.test.js
└── README.md

yaml
Copiar código

---

## 🚀 Como Executar os Testes

### 1️⃣ Criar a pasta de relatórios (caso não exista)
```bash
mkdir -p tests/k6/reports
2️⃣ Executar o teste de performance e gerar o resultado em JSON
bash
Copiar código
k6 run tests/k6/tests/checkout.performance.test.js \
  --out json=tests/k6/reports/resultado.json
3️⃣ Gerar o relatório em HTML
bash
Copiar código
npx k6-html-reporter tests/k6/reports/resultado.json \
  -o tests/k6/reports/k6-report.html
📊 Relatório de Execução
O relatório de execução do teste encontra-se em:

bash
Copiar código
tests/k6/reports/k6-report.html
O relatório apresenta métricas como:

Tempo de resposta

Percentis

Taxa de falhas

Checks

Thresholds

Grupos de execução

🧠 Conceitos Aplicados
✅ Thresholds
Definem critérios mínimos de desempenho que o teste deve atender.

📌 Arquivo: checkout.performance.test.js

js
Copiar código
thresholds: {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
}
📖 95% das requisições devem responder em até 500ms e a taxa de falhas deve ser inferior a 1%.

✅ Checks
Validam se a resposta da API está correta.

📌 Arquivo: checkout.performance.test.js

js
Copiar código
check(response, {
  'status é 200': (r) => r.status === 200,
  'valorFinal retornado': (r) => r.json('valorFinal') !== undefined,
});
📖 Garante sucesso da requisição e retorno do valor final do checkout.

✅ Helpers
Centralizam e reutilizam lógica comum.

📌 Arquivos:

helpers/auth.helper.js

helpers/checkout.helper.js

📖 Separação de responsabilidades e melhor organização do código.

✅ Trends
Métricas customizadas para análise de performance.

📌 Arquivo: checkout.performance.test.js

js
Copiar código
import { Trend } from 'k6/metrics';

export const checkoutDuration = new Trend('checkout_duration');
📖 Permite acompanhar o tempo específico das requisições de checkout.

✅ Faker
Geração de dados dinâmicos para simular usuários diferentes.

📌 Arquivo: checkout.performance.test.js

js
Copiar código
const email = `user_${__VU}_${__ITER}@email.com`;
📖 Evita reutilização de dados fixos durante a execução.

✅ Variáveis de Ambiente
Permitem configuração externa do ambiente de execução.

📌 Arquivo: checkout.performance.test.js

js
Copiar código
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
📖 Possibilita executar o teste em diferentes ambientes sem alterar o código.

✅ Stages
Controlam a carga ao longo do tempo.

📌 Arquivo: config/stages.js

js
Copiar código
export const stages = [
  { duration: '30s', target: 5 },
  { duration: '1m', target: 10 },
  { duration: '30s', target: 0 },
];
📖 Simula rampa de subida, pico e rampa de descida de usuários.

✅ Reaproveitamento de Resposta
Uso do token retornado no login para requisições subsequentes.

📌 Arquivo: helpers/auth.helper.js

📖 O token JWT obtido no login é reutilizado no checkout.

✅ Uso de Token de Autenticação
Autenticação via JWT no endpoint de checkout.

📌 Arquivo: helpers/checkout.helper.js

js
Copiar código
Authorization: `Bearer ${token}`
📖 Garante que apenas usuários autenticados realizem checkout.

✅ Data-Driven Testing
Separação dos dados de entrada do teste.

📌 Arquivo: data/checkout-data.js

📖 Facilita manutenção e variação de cenários de teste.

✅ Groups
Organização do teste em blocos lógicos.

📌 Arquivo: checkout.performance.test.js

js
Copiar código
group('Checkout - pagamento via boleto', () => {
  // execução do checkout
});
📖 Melhora a leitura do relatório e a organização do fluxo de teste.

✅ Conclusão
O teste de performance desenvolvido cobre um fluxo crítico da API (checkout autenticado), aplicando todos os conceitos exigidos no trabalho.
A abordagem adotada permite avaliar desempenho, estabilidade e comportamento da API sob carga de forma clara e organizada.