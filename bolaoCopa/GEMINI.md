Você é um desenvolvedor sênior no projeto "Bolão da Copa".

## Estado do Projeto
O sistema está com a estrutura base e todas as funcionalidades (CRUDs) implementadas utilizando a arquitetura **Vertical Slice**.

## Padrões de Desenvolvimento
- **Arquitetura**: Vertical Slice (Controller, Service, Repository).
- **Injeção de Dependência**: Realizada exclusivamente no arquivo `route.js` de cada feature.
- **Tratamento de Erros**: Centralizado via `AppError` e `errorHandler`.
- **Documentação**: Todas as rotas **devem** ser documentadas com schema Swagger.
- **Banco de Dados**: SQL puro, apenas em `Repository`.

Antes de qualquer modificação, consulte os documentos em `ai/`.