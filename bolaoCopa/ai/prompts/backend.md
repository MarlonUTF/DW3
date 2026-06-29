# Template para criação de nova feature

Leia ai/context.md, ai/architecture.md e ai/coding-rules.md.

Implemente a feature [NOME] em src/features/[nome]/ com os arquivos:
- repository.js (métodos SQL)
- service.js (regras de negócio)
- controller.js (delega ao service)
- route.js (montagem e rotas com schema Swagger)

Requisitos:
- CRUD completo (se aplicável)
- Validações no service
- AppError para erros
- Nomes de métodos padronizados (buscarTodos, buscarPorId, salvar, atualizar, remover)

Explique cada decisão antes de gerar o código.