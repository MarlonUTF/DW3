import pool from '../../database/pool.js'

class PerfilRepository {
  async buscarTodos() {
    const query = 'SELECT id, nome, created_at FROM perfis ORDER BY nome'
    const resultado = await pool.query(query)
    return resultado.rows
  }

  async buscarPorId(id) {
    const query = 'SELECT id, nome, created_at FROM perfis WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }

  async salvar(nome) {
    const query = 'INSERT INTO perfis (nome) VALUES ($1) RETURNING id, nome, created_at'
    const resultado = await pool.query(query, [nome])
    return resultado.rows[0]
  }

  async atualizar(id, nome) {
    const query = 'UPDATE perfis SET nome = $1 WHERE id = $2 RETURNING id, nome, created_at'
    const resultado = await pool.query(query, [nome, id])
    return resultado.rows[0] || null
  }

  async remover(id) {
    const query = 'DELETE FROM perfis WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rowCount > 0
  }
}

export default PerfilRepository
