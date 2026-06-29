import pool from '../../database/pool.js'

class PalpiteRepository {
  async criar(palpite) {
    const { perfil_id, bolao_id, jogo_id, gols_casa, gols_fora } = palpite
    const query = `
      INSERT INTO palpites (perfil_id, bolao_id, jogo_id, gols_casa, gols_fora)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const resultado = await pool.query(query, [perfil_id, bolao_id, jogo_id, gols_casa, gols_fora])
    return resultado.rows[0]
  }

  async buscarPorId(id) {
    const query = 'SELECT * FROM palpites WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }

  async atualizar(id, palpite) {
    const { gols_casa, gols_fora } = palpite
    const query = `
      UPDATE palpites
      SET gols_casa = $1, gols_fora = $2
      WHERE id = $3
      RETURNING *
    `
    const resultado = await pool.query(query, [gols_casa, gols_fora, id])
    return resultado.rows[0]
  }

  async remover(id) {
    const query = 'DELETE FROM palpites WHERE id = $1'
    await pool.query(query, [id])
  }

  async buscarPorBolaoEJogo(perfil_id, bolao_id, jogo_id) {
    const query = 'SELECT * FROM palpites WHERE perfil_id = $1 AND bolao_id = $2 AND jogo_id = $3'
    const resultado = await pool.query(query, [perfil_id, bolao_id, jogo_id])
    return resultado.rows[0] || null
  }
}

export default PalpiteRepository
