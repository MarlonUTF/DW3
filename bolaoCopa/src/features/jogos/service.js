import AppError from '../../shared/AppError.js'
import { cacheManager } from '../../shared/cacheManager.js'

class JogoService {
  constructor(jogoRepository) {
    this.jogoRepository = jogoRepository
  }

  async listarJogos() {
    return await this.jogoRepository.listarTodos()
  }

  async buscarJogo(id) {
    const jogo = await this.jogoRepository.buscarPorId(id)
    if (!jogo) throw new AppError('Jogo não encontrado', 404)
    return jogo
  }

  async criarJogo(jogo) {
    return await this.jogoRepository.criar(jogo)
  }

  async atualizarJogo(id, jogo) {
    const jogoAtualizado = await this.jogoRepository.atualizar(id, jogo)
    if (!jogoAtualizado) throw new AppError('Jogo não encontrado', 404)
    return jogoAtualizado
  }

  async removerJogo(id) {
    const jogo = await this.buscarJogo(id)
    if (jogo.encerrado) {
      throw new AppError('Não é possível excluir um jogo encerrado', 400)
    }
    const removido = await this.jogoRepository.remover(id)
    if (!removido) throw new AppError('Falha ao remover jogo', 400)
    return { mensagem: 'Jogo removido com sucesso' }
  }
}

export default JogoService
