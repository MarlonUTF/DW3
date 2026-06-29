import pool from '../../database/pool.js'

class BolaoRepository {
  async buscarTodos() {
    const query = `
      SELECT b.id, b.nome, b.descricao, b.criador_perfil_id, p.nome AS criador_nome, b.created_at
      FROM boloes b
      JOIN perfis p ON b.criador_perfil_id = p.id
      ORDER BY b.nome
    `
    const resultado = await pool.query(query)
    return resultado.rows
  }

  async buscarPorId(id) {
    const query = `
      SELECT b.id, b.nome, b.descricao, b.criador_perfil_id, p.nome AS criador_nome, b.created_at
      FROM boloes b
      JOIN perfis p ON b.criador_perfil_id = p.id
      WHERE b.id = $1
    `
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }

  async salvar(nome, descricao, criador_perfil_id) {
    const query = `
      INSERT INTO boloes (nome, descricao, criador_perfil_id)
      VALUES ($1, $2, $3)
      RETURNING id, nome, descricao, criador_perfil_id, created_at
    `
    const resultado = await pool.query(query, [nome, descricao, criador_perfil_id])
    return resultado.rows[0]
  }

  async atualizar(id, nome, descricao) {
    const query = `
      UPDATE boloes SET nome = $1, descricao = $2
      WHERE id = $3
      RETURNING id, nome, descricao, criador_perfil_id, created_at
    `
    const resultado = await pool.query(query, [nome, descricao, id])
    return resultado.rows[0] || null
  }

  async remover(id) {
    const query = 'DELETE FROM boloes WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rowCount > 0
  }

  async adicionarParticipante(bolao_id, perfil_id) {
    const query = 'INSERT INTO participantes_bolao (bolao_id, perfil_id) VALUES ($1, $2)'
    await pool.query(query, [bolao_id, perfil_id])
  }

  async participanteExiste(bolao_id, perfil_id) {
    const query = 'SELECT 1 FROM participantes_bolao WHERE bolao_id = $1 AND perfil_id = $2'
    const resultado = await pool.query(query, [bolao_id, perfil_id])
    return resultado.rows.length > 0
  }
}

export default BolaoRepository
