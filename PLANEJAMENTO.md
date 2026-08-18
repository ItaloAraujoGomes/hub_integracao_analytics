# Planejamento — Hub de Integração e Analytics

## 1. Produto de portfólio

Nome de trabalho: InsightBridge.

Uma plataforma B2B fictícia que consolida pedidos de um ERP, enriquece os dados com informações territoriais, climáticas e cambiais, e
disponibiliza indicadores para equipes comerciais e operacionais.

O caso de uso: uma empresa vende em diferentes cidades brasileiras, importa pedidos por CSV, precisa detectar erros, evitar duplicidade,
acompanhar execuções e analisar vendas por localidade, período, clima e moeda.

### Demonstração final

Um recrutador deve conseguir:

1. Subir o ambiente com Docker Compose.
2. Criar uma conta e enviar um CSV de pedidos.
3. Acompanhar a importação assíncrona e ver linhas aceitas e rejeitadas.
4. Consultar indicadores como faturamento por UF, cidade e período.
5. Ver os dados enriquecidos por localização, clima e câmbio.
6. Abrir a documentação da API, testes, diagrama de arquitetura e decisões técnicas.

## 2. Fontes de dados

Fonte Uso no produto Forma de integração Quando entra
━━━━━━━━━━━━━━━━━━━━━━━━━ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ━━━━━━━━━━━━━━
CSV do ERP simulado Fonte principal de pedidos e clientes Upload e processamento assíncrono MVP
───────────────────────── ────────────────────────────────────────────────────────────── ─────────────────────────────────────── ──────────────
IBGE Localidades Validar e enriquecer UF, município, região e códigos HTTP, carga inicial e cache local MVP
oficiais
───────────────────────── ────────────────────────────────────────────────────────────── ─────────────────────────────────────── ──────────────
BrasilAPI CEP v2 Completar endereço e coordenadas geográficas HTTP sob demanda, com cache MVP+
───────────────────────── ────────────────────────────────────────────────────────────── ─────────────────────────────────────── ──────────────
Open-Meteo Associar condições climáticas ao local e data do pedido HTTP por coordenada e data, com cache MVP+
───────────────────────── ────────────────────────────────────────────────────────────── ─────────────────────────────────────── ──────────────
Frankfurter Converter valores de moedas estrangeiras para BRL HTTP por moeda e data, com cache MVP+
───────────────────────── ────────────────────────────────────────────────────────────── ─────────────────────────────────────── ──────────────
Banco Central do Brasil Indicadores econômicos brasileiros API e dados abertos Pós-MVP

### Regras de uso das fontes

- O CSV é essencial: indisponibilidade de APIs externas não pode impedir a importação de pedidos.
- Não realizar varredura de CEPs ou CNPJs. A BrasilAPI deve ser usada apenas para dados presentes nos pedidos.
- Armazenar fonte, momento da coleta, status e erro de cada enriquecimento.
- Aplicar timeout, retry com backoff e limite de concorrência em chamadas externas.
- Falha de enriquecimento não deve apagar nem invalidar um pedido já importado.
- Usar valores decimais para dinheiro e guardar a data da taxa cambial aplicada.

## 3. Stack inicial

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ou Drizzle ORM
- Redis
- BullMQ
- Docker Compose
- OpenAPI/Swagger
- Vitest ou Jest
- Supertest
- GitHub Actions

## 4. Recorte do MVP

### Atores

- Administrador: gerencia usuários e acompanha todas as importações.
- Analista: envia CSVs, consulta resultados e visualiza métricas.

### Fluxo principal

CSV de pedidos → API → arquivo registrado → job na fila
→ validação e saneamento → deduplicação → PostgreSQL
→ enriquecimento geográfico → métricas e consultas

### Campos mínimos do CSV

```text
external_order_id
ordered_at
customer_name
customer_email
cep
city
state
currency
total_amount

O repositório deve conter CSVs de exemplo válidos e inválidos. Nunca utilizar dados pessoais reais.

### Critérios de aceite do MVP

- Autenticação por e-mail e senha com hash seguro.
- Autorização por papel: administrador e analista.
- Upload de CSV com limite de tamanho e validação de cabeçalho.
- Processamento em segundo plano com estados queued, processing, completed e failed.
- Resultado por linha: aceita, rejeitada ou ignorada como duplicada.
- Idempotência: reenviar o mesmo pedido não aumenta o faturamento.
- API documentada para importações, pedidos e métricas.
- Testes unitários das regras de importação.
- Testes de integração dos endpoints principais.

## 5. Arquitetura inicial

Começar como um monólito modular. O objetivo é separar responsabilidades sem criar o custo operacional de microserviços cedo demais.

src/
  modules/
    identity/       usuários, papéis e autenticação
    imports/        uploads, execução e erros por linha
    orders/         regras de pedido e idempotência
    enrichment/     conectores externos e normalização
    analytics/      consultas e métricas
  shared/           configuração, logs, erros e contratos

### Entidades iniciais

- users
- roles
- imports
- import_rows
- orders
- locations
- enrichment_runs
- exchange_rates
- weather_observations

### Índices iniciais

- Chaves estrangeiras.
- Status e data de importação.
- Data do pedido.
- Chave de idempotência: origem + external_order_id.
- Campos usados nas métricas por localidade.

## 6. Marcos de desenvolvimento

 Marco    Entrega                                                             Conceitos praticados
━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 0        README, decisões arquiteturais, lint, format, Docker e CI básico    Clean Code, documentação, GitHub Actions
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 1        API mínima, health check, PostgreSQL, migrações e identidade        Node, Express, segurança, ACID
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 2        Upload de CSV e validação                                           Streams, validação, TDD
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 3        Redis, BullMQ, worker, rastreabilidade e idempotência               Event loop, I/O assíncrono, filas
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 4        Pedidos persistidos e métricas por UF/período                       SQL, índices, agregações, cache-aside
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 5        Conector IBGE e cache geográfico                                    Adapter Pattern, HTTP resiliente
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 6        BrasilAPI e Open-Meteo com degradação controlada                    Integrações, retries e circuit breaker
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 7        Frankfurter e consultas históricas                                  Decimal, séries temporais
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 8        Dashboard simples ou GraphQL                                        REST vs GraphQL
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 9        Logs, métricas, tracing, alertas e deploy                           Observabilidade
───────  ──────────────────────────────────────────────────────────────────  ──────────────────────────────────────────
 10       Terraform, gRPC, warehouse e CQRS                                   Arquitetura avançada

## 7. Fora do escopo inicial

- Microserviços.
- Kubernetes.
- Event Sourcing.
- CQRS completo.
- GraphQL.
- Dashboard sofisticado.
- Consultas em massa a serviços públicos.
- Dados reais de clientes, pagamentos ou credenciais.

Esses itens serão introduzidos somente se houver uma necessidade concreta no projeto.

## 8. Padrão de trabalho

Cada marco seguirá este ciclo:

Problema pequeno
→ critérios de aceite
→ desenho curto
→ implementação
→ testes
→ revisão
→ registro da decisão

Cada Pull Request deve conter:

- Contexto e problema resolvido.
- Decisão técnica adotada.
- Testes executados.
- Evidência de funcionamento.
- Limitações conhecidas.

## 9. Referências

- IBGE — API de Localidades (https://servicodados.ibge.gov.br/api/docs/localidades)
- BrasilAPI — documentação (https://brasilapi.com.br/docs)
- Open-Meteo — Weather Forecast API (https://open-meteo.com/en/docs)
- Frankfurter — API de câmbio (https://frankfurter.dev/)
- Banco Central do Brasil — Dados Abertos (https://dadosabertos.bcb.gov.br/)
```
