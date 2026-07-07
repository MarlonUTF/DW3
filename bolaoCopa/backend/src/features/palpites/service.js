import AppError from '../../shared/AppError.js'

class PalpiteService {
  constructor(palpiteRepository, jogoRepository, bolaoRepository) {
    this.palpiteRepository = palpiteRepository
    this.jogoRepository = jogoRepository
    this.bolaoRepository = bolaoRepository
  }

  async listarTodos() {
    return await this.palpiteRepository.listarTodos()
  }

  async buscarPorId(id) {
    const palpite = await this.palpiteRepository.buscarPorId(id)
    if (!palpite) throw new AppError('Palpite não encontrado', 404)
    return palpite
  }

  async criarPalpite(palpite) {
    const { jogo_id, bolao_id, perfil_id, gols_casa, gols_fora } = palpite

    if (jogo_id === undefined || bolao_id === undefined || perfil_id === undefined ||
        gols_casa === undefined || gols_fora === undefined) {
      throw new AppError('perfil_id, bolao_id, jogo_id, gols_casa e gols_fora são obrigatórios', 400)
    }

    const jogo = await this.jogoRepository.buscarPorId(jogo_id)
    if (!jogo) throw new AppError('Jogo não encontrado', 404)

    // Regra de negócio: não é possível palpitar em jogo já encerrado
    if (jogo.encerrado) throw new AppError('Jogo já encerrado', 400)

    const bolao = await this.bolaoRepository.buscarPorId(bolao_id)
    if (!bolao) throw new AppError('Bolão não encontrado', 404)

    // Regra de negócio: o perfil precisa ser participante do bolão
    const participante = await this.bolaoRepository.buscarParticipante(bolao_id, perfil_id)
    if (!participante) throw new AppError('Perfil não participa deste bolão', 400)

    // Regra de negócio: não pode haver dois palpites do mesmo perfil
    // para o mesmo jogo dentro do mesmo bolão
    const existente = await this.palpiteRepository.buscarPorPerfilBolaoJogo(perfil_id, bolao_id, jogo_id)
    if (existente) throw new AppError('Perfil já possui um palpite para este jogo neste bolão', 400)

    return await this.palpiteRepository.criar(palpite)
  }

  async atualizarPalpite(id, palpite) {
    const existente = await this.palpiteRepository.buscarPorId(id)
    if (!existente) throw new AppError('Palpite não encontrado', 404)

    const jogo = await this.jogoRepository.buscarPorId(existente.jogo_id)
    if (jogo.encerrado) throw new AppError('Jogo já encerrado', 400)

    return await this.palpiteRepository.atualizar(id, {
      gols_casa: palpite.gols_casa ?? existente.gols_casa,
      gols_fora: palpite.gols_fora ?? existente.gols_fora
    })
  }

  async removerPalpite(id) {
    const existente = await this.palpiteRepository.buscarPorId(id)
    if (!existente) throw new AppError('Palpite não encontrado', 404)

    const jogo = await this.jogoRepository.buscarPorId(existente.jogo_id)
    if (jogo.encerrado) throw new AppError('Jogo já encerrado', 400)

    await this.palpiteRepository.remover(id)
  }
}

export default PalpiteService
