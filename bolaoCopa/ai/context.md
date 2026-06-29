# Projeto: Bolão da Copa

**Objetivo:** API RESTful para bolão de palpites da Copa do Mundo 2026.

**Domínio:** Usuários (perfis) criam bolões, entram em bolões e dão palpites nos jogos da Copa. Resultados são lançados e a pontuação é calculada automaticamente.

**Stack:**
- Node.js + Fastify
- PostgreSQL (pg + Pool)
- Swagger/OpenAPI (fastify-swagger)
- dotenv

**Fonte de dados externa:** ESPN API (fifa.world) para jogos, seleções e resultados.

**Tabelas:** perfis, paises, grupos, jogos, resultados, boloes, participantes_bolao, palpites.

Consulte sempre os outros arquivos em ai/ antes de implementar.