# Regras de código

## Sempre
- Usar classes para Controller, Service, Repository.
- Injetar dependências via construtor.
- Validar dados de entrada no Service (lançar AppError se inválido).
- Usar async/await.
- Documentar todas as rotas com schema Swagger (tags, body, params, response).
- Usar o pool importado de src/database/pool.js.
- Respeitar o padrão: `export default NomeDaClasse`.

## Nunca
- Colocar SQL no Controller ou Service.
- Acessar req/res diretamente no Service.
- Usar `new` dentro de Controller ou Service.
- Tratar erros manualmente no Controller (deixe o error handler capturar).