import AppError from '../../shared/AppError.js'

class ResultadoService {
  // Recebe o JogoRepository via injeção de dependência para poder
  // marcar o jogo como encerrado e propagar o chaveamento, sem
  // nunca importar `pg` diretamente aqui.
  constructor(resultadoRepository, jogoRepository) {
    this.resultadoRepository = resultadoRepository
    this.jogoRepository = jogoRepository
  }

  async listarTodos() {
    return await this.resultadoRepository.listarTodos()
  }

  async buscarPorId(id) {
    const resultado = await this.resultadoRepository.buscarPorId(id)
    if (!resultado) throw new AppError('Resultado não encontrado', 404)
    return resultado
  }

  async criarResultado(data) {
    const { jogo_id, gols_casa, gols_fora, vencedor_id } = data

    if (jogo_id === undefined || gols_casa === undefined || gols_fora === undefined) {
      throw new AppError('jogo_id, gols_casa e gols_fora são obrigatórios', 400)
    }

    const jogo = await this.jogoRepository.buscarPorId(jogo_id)
    if (!jogo) throw new AppError('Jogo não encontrado', 404)

    // Regra de negócio: não pode haver dois resultados para o mesmo jogo
    const resultadoExistente = await this.resultadoRepository.buscarPorJogoId(jogo_id)
    if (resultadoExistente) throw new AppError('Resultado já cadastrado para este jogo', 400)

    const resultado = await this.resultadoRepository.criar(data)
    await this.jogoRepository.marcarEncerrado(jogo_id, true)

    if (vencedor_id) {
      await this._propagarChaveamento(jogo_id, vencedor_id)
    }

    return resultado
  }

  async atualizarResultado(id, data) {
    const resultado = await this.resultadoRepository.buscarPorId(id)
    if (!resultado) throw new AppError('Resultado não encontrado', 404)

    const resultadoAtualizado = await this.resultadoRepository.atualizar(id, {
      gols_casa: data.gols_casa ?? resultado.gols_casa,
      gols_fora: data.gols_fora ?? resultado.gols_fora,
      vencedor_id: data.vencedor_id !== undefined ? data.vencedor_id : resultado.vencedor_id
    })

    if (data.vencedor_id !== undefined && data.vencedor_id !== resultado.vencedor_id) {
      await this._propagarChaveamento(resultado.jogo_id, data.vencedor_id)
    }

    return resultadoAtualizado
  }

  async removerResultado(id) {
    const resultado = await this.resultadoRepository.buscarPorId(id)
    if (!resultado) throw new AppError('Resultado não encontrado', 404)

    const removido = await this.resultadoRepository.remover(id)
    if (!removido) throw new AppError('Falha ao remover resultado', 400)

    await this.jogoRepository.marcarEncerrado(removido.jogo_id, false)
    return { mensagem: 'Resultado removido com sucesso' }
  }

  async _propagarChaveamento(jogo_origem_id, vencedor_id) {
    const jogosDestino = await this.jogoRepository.buscarJogosQueDependemDe(jogo_origem_id)

    for (const jogo of jogosDestino) {
      if (jogo.origem_casa_jogo_id === jogo_origem_id) {
        await this.jogoRepository.atualizarPaisCasa(jogo.id, vencedor_id)
      }
      if (jogo.origem_fora_jogo_id === jogo_origem_id) {
        await this.jogoRepository.atualizarPaisFora(jogo.id, vencedor_id)
      }
    }
  }
}

export default ResultadoService
