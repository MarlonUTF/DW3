import pool from '../../database/pool.js'

class ResultadoRepository {
  async listarTodos() {
    const query = `
      SELECT
        r.*,
        j.numero_jogo, j.fase,
        v.nome AS vencedor_nome
      FROM resultados r
      JOIN jogos j ON r.jogo_id = j.id
      LEFT JOIN paises v ON r.vencedor_id = v.id
      ORDER BY j.numero_jogo
    `
    const result = await pool.query(query)
    return result.rows
  }

  async criar(resultado) {
    const { jogo_id, gols_casa, gols_fora, vencedor_id } = resultado
    const query = `
      INSERT INTO resultados (jogo_id, gols_casa, gols_fora, vencedor_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(query, [jogo_id, gols_casa, gols_fora, vencedor_id ?? null])
    return result.rows[0]
  }

  async atualizar(id, resultado) {
    const { gols_casa, gols_fora, vencedor_id } = resultado
    const query = `
      UPDATE resultados
      SET gols_casa = $1, gols_fora = $2, vencedor_id = $3, atualizado_em = now()
      WHERE id = $4
      RETURNING *
    `
    const result = await pool.query(query, [gols_casa, gols_fora, vencedor_id ?? null, id])
    return result.rows[0]
  }

  async buscarPorJogoId(jogo_id) {
    const query = 'SELECT * FROM resultados WHERE jogo_id = $1'
    const result = await pool.query(query, [jogo_id])
    return result.rows[0] || null
  }

  async buscarPorId(id) {
    const query = 'SELECT * FROM resultados WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  async remover(id) {
    const query = 'DELETE FROM resultados WHERE id = $1 RETURNING jogo_id'
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }
}

export default ResultadoRepository
