# 🏆 Bolão da Copa 2026 API

> API RESTful robusta e escalável desenvolvida para gerenciar os palpites da Copa do Mundo 2026.

---

## 🚀 Sobre o Projeto

O **Bolão da Copa 2026 API** é o backend oficial para um sistema de apostas e palpites entre amigos. O foco é a performance, a manutenibilidade e a adesão estrita a padrões de arquitetura corporativa.

### 🛠 Stack Tecnológica

- **Backend**: Node.js com [Fastify](https://fastify.dev/) (alta performance).
- **Banco de Dados**: PostgreSQL com `pg` (Pool de conexões nativo).
- **Documentação**: Swagger / OpenAPI (disponível em `/docs`).
- **Arquitetura**: Vertical Slice com Injeção de Dependência.

---

## 📁 Estrutura do Projeto

Seguimos o padrão **Vertical Slice**, onde o código é organizado por contexto de negócio (feature), facilitando a manutenção e a escalabilidade.

```text
src/
├── database/      # Configuração da conexão com o banco
├── features/      # Módulos do sistema (bolões, jogos, palpites, perfis...)
├── shared/        # Lógica compartilhada (AppError, ErrorHandler)
└── server.js      # Ponto de entrada da aplicação
```

---

## ⚙️ Pré-requisitos

- Node.js (v20+)
- PostgreSQL (v15+)

---

## 🚀 Como Executar

1. **Instalação**:
   ```bash
   npm install
   ```

2. **Desenvolvimento** (com *Hot Reload*):
   ```bash
   npm run dev
   ```

3. **Produção**:
   ```bash
   npm start
   ```

---

## 📝 Documentação da API

Após iniciar o servidor, acesse a documentação interativa em:
`http://localhost:3000/docs`

---

## 🛡️ Padrões de Desenvolvimento

- **Vertical Slice**: Cada feature possui `controller`, `service`, `repository` e `route`.
- **Tratamento de Erros**: Centralizado via `AppError` e `errorHandler` global.
- **Segurança**: SQL puro isolado na camada de `Repository`.
- **Documentação**: Swagger obrigatório para todos os endpoints.

---

*Desenvolvido por Talisson para a disciplina DW3.*
