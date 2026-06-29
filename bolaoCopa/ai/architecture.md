# Arquitetura

## Estrutura de pastas
- src/features/{modulo}/controller.js  → recebe req/res, extrai dados, devolve resposta.
- src/features/{modulo}/service.js     → regras de negócio, validações, lança AppError.
- src/features/{modulo}/repository.js  → acesso ao banco (SQL puro via pool).
- src/features/{modulo}/route.js       → instancia repositório → service → controller e define rotas.

## Fluxo da requisição
Requisição HTTP → Route → Controller → Service → Repository → PostgreSQL

## Tratamento de erros
- AppError (message, statusCode) em src/shared/AppError.js
- Error handler global registrado no server.js (src/shared/errorHandler.js)
- Services lançam `throw new AppError('mensagem', statusCode)`, nunca tratam com try/catch no controller.

## Documentação das rotas
- Todas as rotas devem ter schema Swagger (tags, body, params, response).
- Swagger acessível em /docs.

## Injeção de dependência
- Montagem feita apenas no arquivo de rotas (route.js).
- Proibido usar `new` dentro de Controller ou Service.