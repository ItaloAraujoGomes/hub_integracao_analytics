# ADR 0001: Iniciar com monólito modular

## Status

Aceita.

## Contexto

O InsightBridge precisa importar pedidos por CSV, processá-los em segundo plano, persistir dados e
expor consultas analíticas. No estágio inicial, o projeto ainda não possui escala, equipes
independentes ou limites de domínio comprovados que justifiquem a complexidade de microserviços.

## Decisão

O sistema será desenvolvido inicialmente como um monólito modular em Node.js e TypeScript.

Os módulos de identidade, importações, pedidos, enriquecimento e analytics terão responsabilidades
separadas, mas serão executados no mesmo processo e implantados como uma única aplicação.

## Consequências

### Positivas

- Menor complexidade de desenvolvimento, testes e deploy.
- Transações e depuração mais simples.
- Evolução rápida do MVP.
- Separação de responsabilidades preservada para uma futura extração de serviços, caso necessária.

### Negativas

- Uma única unidade de deploy.
- Escalabilidade inicialmente compartilhada entre módulos.
- Exige disciplina para preservar os limites entre módulos.

## Alternativas consideradas

- **Microserviços:** rejeitados neste momento pelo custo operacional de comunicação distribuída,
  deploy, observabilidade e consistência de dados.
- **Monólito sem módulos:** rejeitado por dificultar manutenção e evolução do domínio.
