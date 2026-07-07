import AppError from '../../shared/AppError.js'

class BolaoService {
  // Injeção de dependência: o Service recebe os Repositories via
  // construtor. Nenhuma consulta SQL é feita aqui — só regra de negócio.
  constructor(bolaoRepository, perfilRepository) {
    this.bolaoRepository = bolaoRepository
    this.perfilRepository = perfilRepository
  }

  async _verificarPerfilExiste(perfil_id) {
    const perfil = await this.perfilRepository.buscarPorId(perfil_id)
    if (!perfil) throw new AppError('Perfil não encontrado', 404)
  }

  async listarTodos() {
    return await this.bolaoRepository.listarTodos()
  }

  async buscarPorId(id) {
    const bolao = await this.bolaoRepository.buscarPorId(id)
    if (!bolao) throw new AppError('Bolão não encontrado', 404)
    return bolao
  }

  async criarBolao({ nome, descricao, criador_perfil_id }) {
    if (!nome || !criador_perfil_id) throw new AppError('Nome e criador são obrigatórios', 400)

    // Regra de negócio 1: o criador precisa existir como perfil
    await this._verificarPerfilExiste(criador_perfil_id)

    const bolao = await this.bolaoRepository.criar(nome, descricao, criador_perfil_id)

    // O criador já entra automaticamente como participante do próprio bolão
    await this.bolaoRepository.adicionarParticipante(bolao.id, criador_perfil_id)

    return bolao
  }

  async atualizarBolao(id, { nome, descricao }) {
    const bolaoAtualizado = await this.bolaoRepository.atualizar(id, nome, descricao)
    if (!bolaoAtualizado) throw new AppError('Bolão não encontrado', 404)
    return bolaoAtualizado
  }

  async deletarBolao(id) {
    const removido = await this.bolaoRepository.remover(id)
    if (!removido) throw new AppError('Bolão não encontrado', 404)
    return { mensagem: 'Bolão removido com sucesso' }
  }

  async listarParticipantes(bolao_id) {
    await this.buscarPorId(bolao_id)
    return await this.bolaoRepository.listarParticipantes(bolao_id)
  }

  async adicionarParticipante(bolao_id, perfil_id) {
    await this._verificarPerfilExiste(perfil_id)
    await this.buscarPorId(bolao_id)

    // Regra de negócio 2: um perfil não pode participar do mesmo bolão duas vezes
    const existe = await this.bolaoRepository.participanteExiste(bolao_id, perfil_id)
    if (existe) throw new AppError('Perfil já é participante deste bolão', 400)

    await this.bolaoRepository.adicionarParticipante(bolao_id, perfil_id)
    return { mensagem: 'Participante adicionado com sucesso' }
  }
}

export default BolaoService
