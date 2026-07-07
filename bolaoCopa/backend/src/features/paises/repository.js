import pool from '../../database/pool.js'

class PaisRepository {
  async buscarTodos() {
    const query = `
      SELECT p.id, p.nome, p.sigla_fifa, p.bandeira_url, p.grupo_id, g.nome AS grupo_nome
      FROM paises p
      LEFT JOIN grupos g ON p.grupo_id = g.id
      ORDER BY p.nome
    `
    const resultado = await pool.query(query)
    return resultado.rows
  }

  async buscarPorId(id) {
    const query = `
      SELECT p.id, p.nome, p.sigla_fifa, p.bandeira_url, p.grupo_id, g.nome AS grupo_nome
      FROM paises p
      LEFT JOIN grupos g ON p.grupo_id = g.id
      WHERE p.id = $1
    `
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }
}

export default PaisRepository
