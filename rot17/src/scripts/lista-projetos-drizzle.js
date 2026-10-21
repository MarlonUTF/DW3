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
