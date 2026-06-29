import pool from '../../database/pool.js'

class JogoRepository {
  async listarTodos() {
    const query = `
      SELECT j.*, r.gols_casa, r.gols_fora, r.vencedor_id
      FROM jogos j
      LEFT JOIN resultados r ON j.id = r.jogo_id
      ORDER BY j.numero_jogo
    `
    const resultado = await pool.query(query)
    return resultado.rows
  }

  async buscarPorId(id) {
    const query = `
      SELECT j.*, r.gols_casa, r.gols_fora, r.vencedor_id
      FROM jogos j
      LEFT JOIN resultados r ON j.id = r.jogo_id
      WHERE j.id = $1
    `
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }

  async criar(jogo) {
    const { numero_jogo, fase, data_hora, estadio, pais_casa_id, pais_fora_id, origem_casa_jogo_id, origem_fora_jogo_id, origem_casa_grupo_id, origem_casa_grupo_posicao, origem_fora_grupo_id, origem_fora_grupo_posicao } = jogo
    const query = `
      INSERT INTO jogos (numero_jogo, fase, data_hora, estadio, pais_casa_id, pais_fora_id, origem_casa_jogo_id, origem_fora_jogo_id, origem_casa_grupo_id, origem_casa_grupo_posicao, origem_fora_grupo_id, origem_fora_grupo_posicao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `
    const resultado = await pool.query(query, [numero_jogo, fase, data_hora, estadio, pais_casa_id, pais_fora_id, origem_casa_jogo_id, origem_fora_jogo_id, origem_casa_grupo_id, origem_casa_grupo_posicao, origem_fora_grupo_id, origem_fora_grupo_posicao])
    return resultado.rows[0]
  }

  async atualizar(id, jogo) {
    const { numero_jogo, fase, data_hora, estadio, pais_casa_id, pais_fora_id, encerrado } = jogo
    const query = `
      UPDATE jogos SET numero_jogo = $1, fase = $2, data_hora = $3, estadio = $4, pais_casa_id = $5, pais_fora_id = $6, encerrado = $7
      WHERE id = $8
      RETURNING *
    `
    const resultado = await pool.query(query, [numero_jogo, fase, data_hora, estadio, pais_casa_id, pais_fora_id, encerrado, id])
    return resultado.rows[0] || null
  }

  async remover(id) {
    const query = 'DELETE FROM jogos WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rowCount > 0
  }
}

export default JogoRepository
