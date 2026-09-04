# Exercícios do Roteiro 15 - Drizzle

## Exercício 1 — Explicar a entrada do ORM

O ORM entra depois do SQL puro porque, antes de abstrair o banco em código, é preciso entender a estrutura real do banco: tabelas, colunas, regras e relacionamentos. O SQL é o idioma base do PostgreSQL e continua sendo essencial para modelar, depurar e ajustar consultas. O Drizzle aparece como uma forma mais organizada de representar essa estrutura em JavaScript, sem substituir o banco nem a lógica que já foi construída com SQL.

## Exercício 2 — Mapear `projetos`

O schema em código foi ampliado para representar a tabela real `projetos` e alinhar o nome da coluna JavaScript com a coluna PostgreSQL.

```js
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const projetos = pgTable('projetos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull()
})
```

## Exercício 3 — Ler projetos com Drizzle

O script abaixo lista os projetos em ordem crescente de id usando o mesmo cliente de banco já configurado.

```js
import db from '../database/drizzle.js'
import pool from '../database/pool.js'
import { projetos } from '../database/schema.js'

try {
  const projetosLista = await db.select().from(projetos).orderBy(projetos.id)
  console.log('Projetos cadastrados:')
  console.table(projetosLista)
} finally {
  await pool.end()
}
```

Arquivo do projeto:
- [rot15_ORM/src/scripts/lista-projetos-drizzle.js](rot15_ORM/src/scripts/lista-projetos-drizzle.js)

## Exercício 4 — Comparar uma operação

### Versão em SQL puro

```js
await pool.query(
  `INSERT INTO tarefas (descricao, concluido) VALUES ($1, $2)`,
  ['Laboratório Drizzle — Roteiro 15', false]
)
```

### Versão em Drizzle

```js
await db.insert(tarefas).values({
  descricao: 'Laboratório Drizzle — Roteiro 15',
  concluido: false
})
```

### Comparação

- Legibilidade: Drizzle tende a ficar mais clara para quem trabalha com o schema em código.
- Controle: SQL puro oferece menor camada de abstração e maior controle direto da query.
- Volume de código: SQL pode ser mais curto para consultas simples; Drizzle organiza melhor quando a estrutura cresce.
- Proximidade com o banco: SQL puro está mais próximo da linguagem do banco; Drizzle está mais próximo da modelagem da aplicação.

Em outras palavras, o SQL continua sendo essencial para entender e depurar o banco, enquanto o Drizzle ajuda a representar essa estrutura no código da aplicação de forma mais organizada.
