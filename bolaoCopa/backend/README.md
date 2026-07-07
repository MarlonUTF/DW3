<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="72" alt="Node.js" />
  <img src="https://cdn.simpleicons.org/fastify/000000" width="60" alt="Fastify" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="72" alt="PostgreSQL" />
</p>

<h1 align="center">⚽ Bolão da Copa 2026</h1>

<p align="center">
  <b>API RESTful para organização de bolões da Copa do Mundo FIFA 2026</b><br>
  <sub>Grupos, jogos, resultados, chaveamento e palpites</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Fastify-5.x-000000?style=flat&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat&logo=swagger&logoColor=black" alt="Swagger">
  <br>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat" alt="License"></a>
</p>

---

## 📖 Sobre o Projeto

O **Bolão da Copa 2026** é uma API RESTful para criação e gerenciamento de bolões de palpites da Copa do Mundo FIFA 2026. O projeto foi desenvolvido como trabalho prático da disciplina de Arquitetura de Software, aplicando **Vertical Slice**, **Orientação a Objetos**, **Injeção de Dependência** e modelagem relacional em **PostgreSQL**, além de documentação automática com **Swagger/OpenAPI**.

Um script auxiliar importa dados reais da Copa (seleções, grupos, calendário e resultados) a partir da API pública da ESPN.

---

## 📚 Índice

- [🗄️ Banco de Dados](#-banco-de-dados)
- [🏗️ Arquitetura](#-arquitetura)
- [⚡ Funcionalidades e Regras de Negócio](#-funcionalidades-e-regras-de-negócio)
- [🚀 Como Executar Localmente](#-como-executar-localmente)
- [📡 Documentação da API](#-documentação-da-api)
- [📌 Script de Importação](#-script-de-importação)
- [📄 Licença](#-licença)

---

## 🗄️ Banco de Dados

Modelado em **PostgreSQL**, com **8 tabelas**:

| Tabela                 | Descrição                                                          |
|-------------------------|---------------------------------------------------------------------|
| `grupos`                | Grupos da Copa do Mundo (A a L).                                    |
| `paises`                | Seleções participantes, com bandeira, sigla FIFA e grupo.           |
| `jogos`                 | Partidas da competição, incluindo fase, estádio e chaveamento.      |
| `resultados`            | Resultados oficiais dos jogos.                                      |
| `perfis`                | Participantes do bolão.                                             |
| `boloes`                | Bolões criados por um perfil.                                       |
| `participantes_bolao`   | Tabela pivô entre perfis e bolões, com pontuação acumulada.         |
| `palpites`              | Palpites registrados por participantes para cada jogo de um bolão.  |

### Relacionamentos exigidos pela atividade

- **1:1** — `resultados` ↔ `jogos` (`UNIQUE` em `jogo_id` + FK).
- **1:N** — `grupos` → `paises`; `perfis` → `boloes` (criador); `paises` → `jogos` (casa/fora).
- **N:N** — `participantes_bolao` (tabela associativa entre `perfis` e `boloes`, com atributos extras como `pontuacao_total`). `palpites` também representa uma relação N:N "resolvida" entre `perfis`/`boloes` e `jogos`.

O arquivo `database.sql`, na raiz do projeto, contém todos os `CREATE TABLE` com PKs, FKs e constraints necessárias para recriar o banco do zero.

---

## 🏗️ Arquitetura

O backend usa **Fastify**, seguindo rigorosamente **Vertical Slice**, **OOP** e **Injeção de Dependência**.

```
backend/
├── database.sql
├── package.json
├── .env
├── scripts/
│   ├── importarCopa.js      # busca dados reais da Copa na API da ESPN
│   └── runImport.js         # roda a importação e encerra o processo
└── src/
    ├── server.js            # Fastify, CORS, Swagger e registro das rotas
    ├── database/
    │   └── pool.js           # única fonte de conexão com o pg
    ├── shared/
    │   ├── AppError.js       # classe de erro customizada
    │   ├── errorHandler.js   # Error Handler Global
    │   └── errorSchema.js    # schema de erro reutilizável no Swagger
    └── features/
        ├── perfis/
        │   ├── controller.js
        │   ├── service.js
        │   ├── repository.js
        │   └── route.js
        ├── paises/      (mesma estrutura)
        ├── boloes/      (mesma estrutura)
        ├── jogos/       (mesma estrutura)
        ├── resultados/  (mesma estrutura)
        └── palpites/    (mesma estrutura)
```

Cada feature segue exatamente as mesmas camadas, implementadas como **Classes**:

- **Controller** — só recebe `req`/`reply`, extrai dados e devolve a resposta. Não contém lógica de negócio.
- **Service** — regras de negócio e validações. Lança `throw new AppError(mensagem, statusCode)` quando algo é inválido. **Nunca** importa `pg` nem conhece `req`/`reply`.
- **Repository** — única camada autorizada a importar `pg` (via `Pool`) e rodar SQL.
- **`route.js`** — monta as instâncias com `new` e injeta as dependências via construtor (`new Service(repository)`, `new Controller(service)`). É o único lugar onde `new` aparece fora do Repository.

### Regras de negócio implementadas

1. Não é possível cadastrar um resultado para um jogo que já possui resultado.
2. Não é possível excluir um jogo já encerrado.
3. Não é possível criar, atualizar ou remover um palpite de um jogo já encerrado.
4. Um perfil não pode participar do mesmo bolão duas vezes.
5. Um perfil não pode registrar dois palpites para o mesmo jogo dentro do mesmo bolão.
6. Um palpite só pode ser criado se o perfil for participante do bolão informado.
7. Ao cadastrar um bolão, o `criador_perfil_id` precisa corresponder a um perfil existente.
8. Ao cadastrar/atualizar um resultado com `vencedor_id`, o time vencedor é propagado automaticamente para os jogos seguintes do chaveamento (ex: um jogo de oitavas que depende do "vencedor do jogo 49").

### Tratamento de erros

Toda exceção de negócio é lançada como `AppError` e capturada pelo **Error Handler Global** (`src/shared/errorHandler.js`), registrado via `server.setErrorHandler(...)`. Ele também traduz erros nativos do driver `pg` (violação de `UNIQUE`, `FOREIGN KEY` e `CHECK`) para o mesmo formato de resposta, sem nenhum `if/else` de tratamento de erro nos Controllers:

```json
{ "status": "error", "message": "Descrição do erro" }
```

---

## ⚡ Funcionalidades e Regras de Negócio

| Recurso | Rotas | Descrição |
|----------|--------|-----------|
| **Países** | `GET /paises`<br>`GET /paises/:id` | Consulta das seleções e seus grupos (JOIN com `grupos`). |
| **Perfis** | `GET /perfis`<br>`POST /perfis`<br>`PATCH /perfis/:id`<br>`DELETE /perfis/:id` | CRUD completo dos participantes. |
| **Bolões** | `GET /boloes`<br>`GET /boloes/:id`<br>`POST /boloes`<br>`PATCH /boloes/:id`<br>`DELETE /boloes/:id`<br>`GET /boloes/:id/participantes`<br>`POST /boloes/:id/participantes` | CRUD de bolões (JOIN com `perfis` para trazer o nome do criador) e gestão de participantes. |
| **Jogos** | `GET /jogos`<br>`GET /jogos/:id`<br>`POST /jogos`<br>`PATCH /jogos/:id`<br>`DELETE /jogos/:id` | CRUD de partidas. `GET` faz `LEFT JOIN` com `paises` (times da casa/fora) e `resultados`, trazendo nomes e placares — não apenas IDs. |
| **Resultados** | `GET /resultados`<br>`GET /resultados/:id`<br>`POST /resultados`<br>`PATCH /resultados/:id`<br>`DELETE /resultados/:id` | Registro de placares com propagação automática do chaveamento. |
| **Palpites** | `GET /palpites`<br>`GET /palpites/:id`<br>`POST /palpites`<br>`PATCH /palpites/:id`<br>`DELETE /palpites/:id` | CRUD de palpites, com `JOIN` trazendo nome do perfil, do bolão e dos países do confronto. |
| **Documentação** | `/docs` | Interface interativa do Swagger/OpenAPI. |

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18 ou superior
- Um banco PostgreSQL acessível (local ou serviço como [Neon](https://neon.tech))

### 1. Clone o repositório e instale as dependências

```bash
git clone https://github.com/seu-usuario/bolao-copa-2026.git
cd bolao-copa-2026/backend
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` (use `.env.example` como base):

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require"
PORT=3000
```

### 3. Execute o script de criação do banco

```bash
psql "$DATABASE_URL" -f database.sql
```

### 4. (Opcional) Importe os dados reais da Copa

```bash
npm run importar
```

Busca seleções, calendário e placares na API pública da ESPN e preenche `grupos`, `paises`, `jogos` e `resultados`. Pode ser executado novamente a qualquer momento para atualizar os dados — o script usa `ON CONFLICT` para não duplicar registros.

> Como a Copa ainda não aconteceu, jogos com confronto ainda não definido (`TBD vs TBD`) ficam com `pais_casa_id`/`pais_fora_id` nulos até serem definidos pela ESPN.

### 5. Inicie o servidor

```bash
npm start
```

A API estará em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.

Para desenvolvimento com recarregamento automático:

```bash
npm run dev
```

---

## 📡 Documentação da API

Com o servidor rodando, acesse **`http://localhost:3000/docs`**.

A documentação Swagger cobre, para cada endpoint:

- Método HTTP (`GET`, `POST`, `PATCH`, `DELETE`);
- Parâmetros de rota (ex: `/jogos/:id`);
- Formato do corpo (`body`) esperado em `POST`/`PATCH`;
- Ao menos uma resposta de sucesso (`200`/`201`) e uma de erro (`400`/`404`) no formato padronizado do Error Handler Global.

---

## 📌 Script de Importação

`scripts/importarCopa.js` exporta a função `importarDadosESPN()`, responsável por:

- Criar os 12 grupos (A–L) e importar as 48 seleções via API da ESPN;
- Importar o calendário oficial de jogos (fase de grupos e mata-mata);
- Resolver automaticamente as origens do chaveamento (ex: converter `"Winner 49"` no ID real do jogo 49);
- Registrar os placares dos jogos já encerrados.

`scripts/runImport.js` apenas chama essa função e encerra o processo — é o que roda quando você executa `npm run importar`.

---

## 🙏 Créditos dos Dados

Os dados de seleções, grupos, calendário e resultados são obtidos da API pública da ESPN, com base na documentação mantida pela comunidade em [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) (projeto independente, sem afiliação oficial com a ESPN).

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  Feito com ⚽ e Node.js<br>
  <sub>API Bolão da Copa 2026 — Trabalho Prático de Arquitetura de Software</sub>
</p>
