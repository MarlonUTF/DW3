import AppError from '../../shared/AppError.js'
import pool from '../../database/pool.js'

class ResultadoService {
  constructor(resultadoRepository) {
    this.resultadoRepository = resultadoRepository
  }

  async criarResultado(data) {
    const { jogo_id, vencedor_id } = data
    const jogoRes = await pool.query('SELECT encerrado FROM jogos WHERE id = $1', [jogo_id])
    if (jogoRes.rows.length === 0 || jogoRes.rows[0].encerrado) {
      throw new AppError('Jogo não encontrado ou já encerrado', 400)
    }

    const resultadoExistente = await this.resultadoRepository.buscarPorJogoId(jogo_id)
    if (resultadoExistente) {
      throw new AppError('Resultado já cadastrado para este jogo', 400)
    }

    const resultado = await this.resultadoRepository.criar(data)
    await pool.query('UPDATE jogos SET encerrado = TRUE WHERE id = $1', [jogo_id])

    // Propagar chaveamento
    await this._propagarChaveamento(jogo_id, vencedor_id)

    return resultado
  }

  async _propagarChaveamento(jogo_origem_id, vencedor_id) {
    // Busca jogos de destino que dependem deste jogo como origem
    const jogosDestino = await pool.query(
      'SELECT id, origem_casa_jogo_id, origem_fora_jogo_id FROM jogos WHERE origem_casa_jogo_id = $1 OR origem_fora_jogo_id = $1',
      [jogo_origem_id]
    )

    for (const jogo of jogosDestino.rows) {
      if (jogo.origem_casa_jogo_id === jogo_origem_id) {
        await pool.query('UPDATE jogos SET pais_casa_id = $1 WHERE id = $2', [vencedor_id, jogo.id])
      } else if (jogo.origem_fora_jogo_id === jogo_origem_id) {
        await pool.query('UPDATE jogos SET pais_fora_id = $1 WHERE id = $2', [vencedor_id, jogo.id])
      }
    }
  }

  async atualizarResultado(id, data) {
    const resultado = await this.resultadoRepository.atualizar(id, data)
    if (!resultado) {
      throw new AppError('Resultado não encontrado', 404)
    }
    return resultado
  }
}

export default ResultadoService
