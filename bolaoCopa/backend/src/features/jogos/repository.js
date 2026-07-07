import pool from '../../database/pool.js'

class JogoRepository {
  async listarTodos() {
    const query = `
      SELECT
        j.*,
        pc.nome AS pais_casa_nome, pc.sigla_fifa AS pais_casa_sigla, pc.bandeira_url AS pais_casa_bandeira,
        pf.nome AS pais_fora_nome, pf.sigla_fifa AS pais_fora_sigla, pf.bandeira_url AS pais_fora_bandeira,
        r.gols_casa, r.gols_fora, r.vencedor_id
      FROM jogos j
      LEFT JOIN paises pc ON j.pais_casa_id = pc.id
      LEFT JOIN paises pf ON j.pais_fora_id = pf.id
      LEFT JOIN resultados r ON j.id = r.jogo_id
      ORDER BY j.numero_jogo
    `
    const resultado = await pool.query(query)
    return resultado.rows
  }

  async buscarPorId(id) {
    const query = `
      SELECT
        j.*,
        pc.nome AS pais_casa_nome, pc.sigla_fifa AS pais_casa_sigla, pc.bandeira_url AS pais_casa_bandeira,
        pf.nome AS pais_fora_nome, pf.sigla_fifa AS pais_fora_sigla, pf.bandeira_url AS pais_fora_bandeira,
        r.gols_casa, r.gols_fora, r.vencedor_id
      FROM jogos j
      LEFT JOIN paises pc ON j.pais_casa_id = pc.id
      LEFT JOIN paises pf ON j.pais_fora_id = pf.id
      LEFT JOIN resultados r ON j.id = r.jogo_id
      WHERE j.id = $1
    `
    const resultado = await pool.query(query, [id])
    return resultado.rows[0] || null
  }

  async criar(jogo) {
    const {
      numero_jogo, fase, data_hora, estadio, encerrado,
      pais_casa_id, pais_fora_id,
      origem_casa_jogo_id, origem_fora_jogo_id,
      origem_casa_grupo_id, origem_casa_grupo_posicao,
      origem_fora_grupo_id, origem_fora_grupo_posicao
    } = jogo

    const query = `
      INSERT INTO jogos (
        numero_jogo, fase, data_hora, estadio, encerrado,
        pais_casa_id, pais_fora_id,
        origem_casa_jogo_id, origem_fora_jogo_id,
        origem_casa_grupo_id, origem_casa_grupo_posicao,
        origem_fora_grupo_id, origem_fora_grupo_posicao
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING *
    `
    const resultado = await pool.query(query, [
      numero_jogo, fase, data_hora, estadio, encerrado ?? false,
      pais_casa_id ?? null, pais_fora_id ?? null,
      origem_casa_jogo_id ?? null, origem_fora_jogo_id ?? null,
      origem_casa_grupo_id ?? null, origem_casa_grupo_posicao ?? null,
      origem_fora_grupo_id ?? null, origem_fora_grupo_posicao ?? null
    ])
    return resultado.rows[0]
  }

  async atualizar(id, jogo) {
    const {
      numero_jogo, fase, data_hora, estadio, encerrado,
      pais_casa_id, pais_fora_id,
      origem_casa_jogo_id, origem_fora_jogo_id,
      origem_casa_grupo_id, origem_casa_grupo_posicao,
      origem_fora_grupo_id, origem_fora_grupo_posicao
    } = jogo

    const query = `
      UPDATE jogos SET
        numero_jogo = $1, fase = $2, data_hora = $3, estadio = $4, encerrado = $5,
        pais_casa_id = $6, pais_fora_id = $7,
        origem_casa_jogo_id = $8, origem_fora_jogo_id = $9,
        origem_casa_grupo_id = $10, origem_casa_grupo_posicao = $11,
        origem_fora_grupo_id = $12, origem_fora_grupo_posicao = $13
      WHERE id = $14
      RETURNING *
    `
    const resultado = await pool.query(query, [
      numero_jogo, fase, data_hora, estadio, encerrado ?? false,
      pais_casa_id ?? null, pais_fora_id ?? null,
      origem_casa_jogo_id ?? null, origem_fora_jogo_id ?? null,
      origem_casa_grupo_id ?? null, origem_casa_grupo_posicao ?? null,
      origem_fora_grupo_id ?? null, origem_fora_grupo_posicao ?? null,
      id
    ])
    return resultado.rows[0] || null
  }

  async remover(id) {
    const query = 'DELETE FROM jogos WHERE id = $1'
    const resultado = await pool.query(query, [id])
    return resultado.rowCount > 0
  }

  async buscarJogosQueDependemDe(jogo_id) {
    const query = `
      SELECT id, origem_casa_jogo_id, origem_fora_jogo_id
      FROM jogos
      WHERE origem_casa_jogo_id = $1 OR origem_fora_jogo_id = $1
    `
    const resultado = await pool.query(query, [jogo_id])
    return resultado.rows
  }

  async atualizarPaisCasa(id, pais_id) {
    await pool.query('UPDATE jogos SET pais_casa_id = $1 WHERE id = $2', [pais_id, id])
  }

  async atualizarPaisFora(id, pais_id) {
    await pool.query('UPDATE jogos SET pais_fora_id = $1 WHERE id = $2', [pais_id, id])
  }

  async marcarEncerrado(id, encerrado) {
    await pool.query('UPDATE jogos SET encerrado = $1 WHERE id = $2', [encerrado, id])
  }
}

export default JogoRepository
