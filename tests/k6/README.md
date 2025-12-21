# Testes de Performance com K6 – API Checkout (REST)

Este projeto contém testes automatizados de performance desenvolvidos com **K6**, aplicados sobre o endpoint de **Checkout da API REST** fornecida no curso.  
O objetivo é validar desempenho, estabilidade e regras de negócio do fluxo de checkout autenticado sob carga.

---

## Estrutura do Projeto

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

---

## Como Executar os Testes

### Subir a API REST
Antes de executar qualquer teste de performance, é necessário que a API esteja em execução, pois o K6 irá realizar chamadas HTTP reais contra os endpoints.
Na raiz do projeto, execute:
```bash
node rest/server.js
```
### Registrar um usuário (execução única)
O endpoint de checkout exige autenticação via token JWT.
Por esse motivo, é necessário registrar previamente um usuário na API.

Em um novo terminal, execute:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Usuario Performance","email":"perf@test.com","password":"senha123"}'
```

### Realizar login e obter o token JWT
Após o registro, é necessário realizar o login para obter o token JWT, que será utilizado para autenticação no teste de checkout.
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"perf@test.com","password":"senha123"}'
```

### Configurar variáveis de ambiente
As configurações sensíveis do teste, como a URL da API e o token JWT, são definidas através de variáveis de ambiente.

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```env
BASE_URL=http://localhost:3000
TOKEN_JWT=cole_o_token_aqui
```

Em seguida, exporte as variáveis para o ambiente de execução:
```bash
export $(grep -v '^#' .env | xargs)
```

Essas variáveis são acessadas no código de teste por meio do objeto __ENV do K6, garantindo maior segurança e flexibilidade.

### Executar o teste de performance
Com a API em execução e as variáveis de ambiente configuradas, execute o teste de performance:
```bash
k6 run tests/k6/tests/checkout.performance.test.js
```
Durante a execução, o K6 irá:
Simular múltiplos usuários virtuais (VUs)
Executar o endpoint de checkout sob carga
Validar respostas com checks
Medir métricas de tempo de resposta
Avaliar thresholds configurados

### Relatorio de Testes
O relátorio se encontra no pasta reports > k6-report.html


## Conceitos Aplicados
### Thresholds
Definem critérios mínimos de desempenho que o teste deve atender.
Arquivo: checkout.performance.test.js

``` js
thresholds: {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.05'],
}
```
95% das requisições devem responder em até 500ms e a taxa de falhas deve ser inferior a 1%.

### Checks
Validam se a resposta da API está correta.

Arquivo: checkout.performance.test.js

``` js
check(response, {
  'status é 200': (r) => r.status === 200,
  'valorFinal retornado': (r) => r.json('valorFinal') !== null,
});
```
Garante sucesso da requisição e retorno do valor final do checkout.

### Helpers
Centralizam e reutilizam lógica comum.

Arquivos:

helpers/auth.helper.js
helpers/checkout.helper.js
helpers/html-reports.js

Separação de responsabilidades e melhor organização do código.

### Trends
Métricas customizadas para análise de performance.

Arquivo: checkout.performance.test.js

``` js
import { Trend } from 'k6/metrics';
export const checkoutDuration = new Trend('checkout_duration');
```
Permite acompanhar o tempo específico das requisições de checkout.


### Variáveis de Ambiente
Os testes de performance utilizam variáveis de ambiente para evitar dados sensíveis no código
e garantir maior flexibilidade de execução em diferentes ambientes.

As seguintes variáveis devem ser configuradas antes da execução:

```env
BASE_URL=http://localhost:3000
TOKEN_JWT=cole_o_token_jwt_aqui
```
BASE_URL: URL base da API que será testada.
TOKEN_JWT: Token de autenticação obtido previamente via login na API.


### Stages
Controlam a carga ao longo do tempo.
Arquivo: config/stages.js

```js
export const stages = [
  { duration: '30s', target: 5 },
  { duration: '1m', target: 10 },
  { duration: '30s', target: 0 },
];
```
Simula rampa de subida, pico e rampa de descida de usuários.

### Reaproveitamento de Resposta
O token JWT obtido no login é reaproveitado durante todo o teste de performance por meio de variável de ambiente, evitando execuções repetidas do endpoint de autenticação sob carga

### Uso de Token de Autenticação
Autenticação via JWT no endpoint de checkout.

Arquivo: helpers/checkout.helper.js

```js
Authorization: `Bearer ${token}`
``` 
Garante que apenas usuários autenticados realizem checkout.

### Data-Driven Testing
Separação dos dados de entrada do teste.

Arquivo: data/checkout-data.js

Facilita manutenção e variação de cenários de teste.

### Groups
Organização do teste em blocos lógicos.

Arquivo: checkout.performance.test.js

```js
group('Checkout - pagamento via boleto', () => {
  // execução do checkout
});
```
Melhora a leitura do relatório e a organização do fluxo de teste.

Conclusão
O teste de performance desenvolvido cobre um fluxo crítico da API (checkout autenticado), aplicando todos os conceitos estudados no curso.
