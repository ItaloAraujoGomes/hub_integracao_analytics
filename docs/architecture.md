# Arquitetura

## Visão geral

O InsightBridge começa como um monólito modular. Essa escolha reduz a complexidade operacional
inicial e mantém as regras de negócio organizadas em módulos independentes.

A aplicação importará pedidos por CSV, processará os registros em segundo plano, persistirá dados no
PostgreSQL e disponibilizará consultas analíticas por API.

## Componentes

```mermaid
flowchart LR
    Client[Cliente ou sistema ERP] --> API[API REST]
    API --> PostgreSQL[(PostgreSQL)]
    API --> Redis[(Redis)]
    API --> Queue[Fila de importações]
    Queue --> Worker[Worker]
    Worker --> PostgreSQL
    Worker --> External[APIs externas]

## Organização prevista

src/
  modules/
    identity/       usuários, papéis e autenticação
    imports/        upload, execução e erros por linha
    orders/         pedidos e idempotência
    enrichment/     conectores externos e normalização
    analytics/      consultas e métricas
  shared/           configuração, logs, erros e contratos

## Responsabilidades

- API REST: recebe requisições, autentica usuários e expõe dados.
- PostgreSQL: armazena dados transacionais e resultados de importação.
- Redis: suporta filas e cache.
- Worker: processa importações sem bloquear as requisições da API.
- Conectores externos: enriquecem dados; suas falhas não impedem a importação de pedidos.

## Princípios

- Monólito modular antes de microserviços.
- Processamento assíncrono para importações.
- Idempotência para evitar pedidos duplicados.
- Falhas de integrações externas não invalidam pedidos persistidos.
- Dados financeiros usam valores decimais.
```
