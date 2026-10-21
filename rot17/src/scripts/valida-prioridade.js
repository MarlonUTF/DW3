import pool from '../database/pool.js'

try {
  const resultado = await pool.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'tarefas'
      AND column_name = 'prioridade'
  `)

  console.log('Verificação da coluna prioridade na tabela tarefas:')
  console.table(resultado.rows)

  if (resultado.rows.length === 0) {
    console.log('⚠️ A coluna prioridade ainda não existe no PostgreSQL.')
  } else {
    console.log('✅ A coluna prioridade foi encontrada no banco.')
  }
} catch (erro) {
  console.error('❌ Falha ao consultar a coluna prioridade:', erro)
} finally {
  await pool.end()
}
