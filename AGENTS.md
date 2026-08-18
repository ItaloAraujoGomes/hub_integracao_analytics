# Hub de Integração e Analytics

## Ideia

Aplicação para centralizar dados de fontes heterogêneas, como ERPs, APIs externas, arquivos CSV e sistemas de vendas. O sistema extrai, valida,
normaliza, processa e disponibiliza esses dados por APIs e painéis analíticos.

O produto de portfólio terá o nome provisório de InsightBridge: uma plataforma B2B fictícia que importa pedidos, enriquece-os com dados
territoriais, climáticos e cambiais, e gera indicadores comerciais.

## Fontes de dados previstas

- CSV de um ERP simulado: fonte principal de pedidos.
- IBGE Localidades: UFs, municípios, regiões e códigos oficiais.
- BrasilAPI: CEP e geolocalização, somente em consultas pontuais e com cache.
- Open-Meteo: dados climáticos por coordenada e data.
- Frankfurter: cotações atuais e históricas para conversão de moeda.
- Banco Central do Brasil: extensão futura para indicadores econômicos.

## Objetivos de aprendizado

- Backend Node.js assíncrono com TypeScript e Express.
- APIs REST e, futuramente, GraphQL e gRPC quando houver necessidade.
- Autenticação, autorização e auditoria com JWT e OAuth.
- PostgreSQL, modelagem relacional, índices, transações e otimização de consultas.
- Redis e padrões de cache; filas e jobs em segundo plano com BullMQ.
- ETL, qualidade de dados, idempotência e rastreabilidade de importações.
- Clean Code, SOLID, DDD, TDD e arquitetura modular.
- Docker, CI/CD, Terraform, logs, métricas, health checks e deploy.

## Stack inicial

- Node.js + TypeScript + Express
- PostgreSQL
- Prisma ou Drizzle ORM
- Redis + BullMQ
- Docker Compose
- OpenAPI/Swagger
- Vitest ou Jest + Supertest
- GitHub Actions

## Escopo inicial

Importar pedidos de uma fonte simulada em CSV, enfileirar o processamento, validar e persistir os registros no PostgreSQL. Expor uma API
autenticada para consultar pedidos, resultados das importações e métricas por localidade e período.

## Evolução

Começar como monólito modular. Evoluir para cache, integrações externas, filas, gateway, GraphQL, gRPC ou componentes distribuídos somente quando
houver necessidade comprovada.

## Modo de mentoria

Este é um projeto público de portfólio. O foco é aprendizagem deliberada: trabalhar em incrementos pequenos, discutir decisões e trade-offs,
escrever testes e registrar decisões arquiteturais relevantes.

O usuário é o autor principal do código. Ao colaborar, agir primeiro como mentor e revisor: explicar o objetivo da tarefa, propor critérios de
aceite, apontar riscos e revisar a solução. Só implementar código diretamente quando o usuário solicitar explicitamente.

Manter README, documentação de arquitetura, exemplos de uso e histórico de decisões claros para recrutadores.
