import AppError from '../../shared/AppError.js'

class PalpiteService {
  constructor(palpiteRepository, jogoRepository, bolaoRepository) {
    this.palpiteRepository = palpiteRepository
    this.jogoRepository = jogoRepository
    this.bolaoRepository = bolaoRepository
  }

  async criar(palpite) {
    const jogo = await this.jogoRepository.buscarPorId(palpite.jogo_id)
    if (!jogo) {
      throw new AppError('Jogo não encontrado', 404)
    }
    if (jogo.encerrado) {
      throw new AppError('Não é possível criar um palpite para um jogo encerrado', 400)
    }

    const participante = await this.bolaoRepository.participanteExiste(palpite.bolao_id, palpite.perfil_id)
    if (!participante) {
      throw new AppError('Perfil não participa deste bolão', 400)
    }

    return await this.palpiteRepository.criar(palpite)
  }

  async atualizar(id, palpite) {
    const palpiteExistente = await this.palpiteRepository.buscarPorId(id)
    if (!palpiteExistente) {
      throw new AppError('Palpite não encontrado', 404)
    }

    const jogo = await this.jogoRepository.buscarPorId(palpiteExistente.jogo_id)
    if (jogo.encerrado) {
      throw new AppError('Não é possível atualizar um palpite de um jogo encerrado', 400)
    }

    return await this.palpiteRepository.atualizar(id, palpite)
  }

  async remover(id) {
    const palpiteExistente = await this.palpiteRepository.buscarPorId(id)
    if (!palpiteExistente) {
      throw new AppError('Palpite não encontrado', 404)
    }

    const jogo = await this.jogoRepository.buscarPorId(palpiteExistente.jogo_id)
    if (jogo.encerrado) {
      throw new AppError('Não é possível remover um palpite de um jogo encerrado', 400)
    }

    await this.palpiteRepository.remover(id)
  }
}

export default PalpiteService
