# Roteiro 16 - Modelando o Banco com Drizzle

## Objetivo

Representar no Drizzle as cinco tabelas do banco e as regras já existentes no PostgreSQL, preservando as decisões de modelagem que foram tomadas nos roteiros anteriores.

## 1) Schema final em Drizzle

```js
import { boolean, date, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const projetos = pgTable('projetos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

export const tarefas = pgTable('tarefas', {
  id: serial('id').primaryKey(),
  descricao: text('descricao').notNull(),
  concluido: boolean('concluido').notNull().default(false),
  criadaEm: timestamp('criada_em').notNull().defaultNow(),
  projetoId: integer('projeto_id').references(() => projetos.id),
})

export const detalhesProjeto = pgTable('detalhes_projeto', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').notNull().unique().references(() => projetos.id),
  descricaoLonga: text('descricao_longa'),
  observacoes: text('observacoes'),
  prazoFinal: date('prazo_final'),
})

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull().unique(),
})

export const tarefasTags = pgTable('tarefas_tags', {
  tarefaId: integer('tarefa_id').notNull().references(() => tarefas.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
}, (table) => [
  primaryKey({ columns: [table.tarefaId, table.tagId] }),
])
```

## Exercício 1 — Diferenciar relação 1:N e 1:1

### Enunciado
Compare `tarefas.projetoId` e `detalhesProjeto.projetoId` e explique por que apenas o segundo tem `.notNull().unique()`.

### Resolução

`projetos` e `tarefas` formam uma relação 1:N:
- um projeto pode ter muitas tarefas;
- cada tarefa pode apontar para um projeto;
- por isso `tarefa.projeto_id` não é obrigatório e não é único.

`detalhes_projeto` representa uma relação 1:1:
- cada projeto pode ter no máximo um detalhamento;
- cada detalhamento pertence a um projeto;
- por isso `detalhes_projeto.projeto_id` usa `.notNull()` e `.unique()`.

Além disso, um projeto pode existir sem detalhamento. A regra do banco garante apenas que, quando houver um detalhamento, ele seja único para aquele projeto.

## Exercício 2 — Omissão de `criado_em`

### Enunciado
Imagine que um colega declarou `projetos` apenas com `id` e `nome`. Qual coluna está faltando e qual linha Drizzle completa essa representação?

### Resolução
A coluna faltante é `criado_em`:

```js
criadoEm: timestamp('criado_em').notNull().defaultNow(),
```

Ela representa:
- `TIMESTAMP` → `timestamp(...)`
- `NOT NULL` → `.notNull()`
- `DEFAULT NOW()` → `.defaultNow()`

Uma leitura simples com `SELECT` ainda pode funcionar sem essa coluna, porque o banco continua lendo os registros existentes. O problema é estrutural: o schema não representa a tabela completa nem o padrão de criação que foi decidido no banco.

## Exercício 3 — Raciocinar sobre a chave composta

### Enunciado
Considere os pares `(2, 1)`, `(2, 3)` e `(4, 1)`. Explique por que eles podem coexistir, por que `(2, 1)` não pode aparecer duas vezes e o que seria perdido se `tarefa_id` fosse único.

### Resolução
No relacionamento N:N, a tabela `tarefas_tags` usa uma chave primária composta formada por `(tarefa_id, tag_id)`. Isso significa que a repetição do par inteiro é proibida, mas a repetição de cada coluna individualmente é permitida.

Os pares `(2, 1)`, `(2, 3)` e `(4, 1)` são diferentes, então podem coexistir no banco:
- a tarefa 2 recebe a tag 1;
- a tarefa 2 recebe a tag 3;
- a tarefa 4 recebe a tag 1.

Se aparecer outra linha com `(2, 1)`, ela seria rejeitada porque repete a chave primária composta inteira.

Se `tarefa_id` tivesse unicidade individual, uma tarefa só poderia aparecer em uma associação. Isso destruiria o comportamento correto do N:N, em que uma tarefa pode ter várias tags e uma tag pode ser usada por várias tarefas.

## Exercício 4 — Alterar apenas o schema sem alterar o banco

### Enunciado
Se alguém remover `.unique()` de `tags.nome` apenas no arquivo `schema.js`, isso remove a restrição do PostgreSQL? Qual leitura seria suficiente para descobrir isso?

### Resolução
Não. Alterar o schema em JavaScript não altera automaticamente o PostgreSQL. A restrição continua no banco enquanto o banco não for mexido por migração ou comando SQL.

Uma leitura com `SELECT` não é suficiente para detectar essa divergência. O `SELECT` apenas mostra dados; ele não avalia se a representação em código está completa ou se a regra de unicidade está sendo preservada.

A forma correta é comparar:
- a estrutura real do banco;
- as definições em `schema.js`;
- a presença de `.notNull()`, `.unique()`, `.defaultNow()`, `.references()` e `primaryKey()`.

## Exercício 5 — Conferir `detalhes_projeto` de ponta a ponta

### Enunciado
Escolha `detalhes_projeto` e entregue o `CREATE TABLE`, a representação em `pgTable`, a correspondência entre as regras e o que o script de leitura mostra.

### Resolução

#### SQL correspondente

```sql
CREATE TABLE IF NOT EXISTS detalhes_projeto (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER NOT NULL UNIQUE,
  descricao_longa TEXT,
  observacoes TEXT,
  prazo_final DATE,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id)
)
```

#### Representação em Drizzle

```js
export const detalhesProjeto = pgTable('detalhes_projeto', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').notNull().unique().references(() => projetos.id),
  descricaoLonga: text('descricao_longa'),
  observacoes: text('observacoes'),
  prazoFinal: date('prazo_final'),
})
```

#### Correspondência

- `id SERIAL PRIMARY KEY` → `serial('id').primaryKey()`
- `projeto_id INTEGER NOT NULL` → `integer('projeto_id').notNull()`
- `UNIQUE` → `.unique()`
- `FOREIGN KEY (projeto_id) REFERENCES projetos(id)` → `.references(() => projetos.id)`
- `descricao_longa TEXT` → `text('descricao_longa')`
- `observacoes TEXT` → `text('observacoes')`
- `prazo_final DATE` → `date('prazo_final')`

#### O que o script mostra

O script lê a tabela e imprime os dados em formato tabular. Se a tabela estiver vazia, o resultado será uma lista vazia. Isso mostra que a conexão e a leitura do schema funcionam, mas não substitui a conferência estrutural. A leitura prova que o módulo consegue consultar a tabela; a comparação com o SQL prova que as regras foram representadas corretamente.

## 6) Script de leitura usado para validar

```js
import db from '../database/drizzle.js'
import pool from '../database/pool.js'
import { detalhesProjeto, projetos, tags, tarefas, tarefasTags } from '../database/schema.js'

try {
  const listaProjetos = await db.select().from(projetos).orderBy(projetos.id)
  console.log('Projetos:')
  console.table(listaProjetos)

  const listaTarefas = await db.select().from(tarefas).orderBy(tarefas.id)
  console.log('Tarefas:')
  console.table(listaTarefas)

  const listaDetalhes = await db.select().from(detalhesProjeto).orderBy(detalhesProjeto.id)
  console.log('Detalhes dos projetos:')
  console.table(listaDetalhes)

  const listaTags = await db.select().from(tags).orderBy(tags.id)
  console.log('Tags:')
  console.table(listaTags)

  const listaAssociacoes = await db.select().from(tarefasTags)
    .orderBy(tarefasTags.tarefaId, tarefasTags.tagId)
  console.log('Associações entre tarefas e tags:')
  console.table(listaAssociacoes)
} finally {
  await pool.end()
}
```

## Conclusão

O schema do Drizzle representa corretamente as regras que o PostgreSQL já conhecia:
- `projetos`: nome obrigatório e data de criação automática;
- `tarefas`: descrição obrigatória, status padrão e vínculo opcional com projeto;
- `detalhes_projeto`: no máximo um detalhamento por projeto;
- `tags`: nome obrigatório e único;
- `tarefas_tags`: associação N:N com chave primária composta.

A leitura do banco confirma a conexão e a disponibilidade das colunas. A conferência com o schema e com o SQL valida as regras de negócio e as constraints que não aparecem apenas nos dados.
