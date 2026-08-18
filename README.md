# InsightBridge

Plataforma B2B fictícia para importar pedidos de um ERP simulado, validar e normalizar dados,
enriquecer informações territoriais e gerar indicadores comerciais.

Este é um projeto de estudo e portfólio, construído incrementalmente. O primeiro objetivo é
estabelecer uma base de backend confiável antes de implementar os fluxos de negócio.

## Stack

- Node.js e TypeScript
- PostgreSQL
- Redis
- Prisma ORM
- Docker Compose
- ESLint e Prettier
- GitHub Actions

## Pré-requisitos

- Node.js 22 ou superior
- Docker Desktop com Docker Compose

## Configuração local

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://insightbridge:insightbridge_dev@localhost:5432/insightbridge?schema=public"
```

Suba as dependências locais:

```bash
docker compose up -d
```

Verifique o status dos containers:

```bash
docker compose ps
```

## Comandos

| Comando                | Finalidade                                     |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Executa a aplicação em modo de desenvolvimento |
| `npm run build`        | Compila o TypeScript para `dist/`              |
| `npm run typecheck`    | Valida os tipos sem gerar arquivos             |
| `npm run lint`         | Executa a análise estática                     |
| `npm run format`       | Verifica a formatação                          |
| `npm run format:write` | Aplica a formatação                            |
| `docker compose up -d` | Inicia PostgreSQL e Redis                      |
| `docker compose down`  | Para os containers                             |

## Qualidade

Em cada push e pull request para main, o GitHub Actions executa:

1. instalação determinística das dependências;
2. lint;
3. verificação de formatação;
4. checagem de tipos;
5. build.

## Próximos passos

- Implementar a API Express e o endpoint de saúde.
- Modelar identidade, usuários e papéis.
- Criar as primeiras migrações com Prisma.
- Implementar o fluxo de importação de pedidos por CSV.

## Documentação

- [Planejamento](./PLANEJAMENTO.md)
- ./docs/adr/
