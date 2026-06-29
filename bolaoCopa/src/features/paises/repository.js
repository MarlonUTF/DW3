import pool from '../../database/pool.js'

class PaisRepository {
  async buscarTodos() {
    const query = 'SELECT id, nome, sigla_fifa, bandeira_url, grupo_id FROM paises ORDER BY nome'
    const resultado = await pool.query(query)
    return resultado.rows
  }

  async buscarPorId(id) {
    const query = 'SELECT id, nome, sigla_fifa, bandeira_url, grupo_id FROM paises WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }
}

export default PaisRepository
