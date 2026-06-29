import AppError from '../../shared/AppError.js'
import pool from '../../database/pool.js'

class BolaoService {
  constructor(bolaoRepository) {
    this.bolaoRepository = bolaoRepository
  }

  async _verificarPerfilExiste(perfil_id) {
    const res = await pool.query('SELECT id FROM perfis WHERE id = $1', [perfil_id])
    if (res.rows.length === 0) {
      throw new AppError('Perfil não encontrado', 404)
    }
  }

  async listarTodos() {
    return await this.bolaoRepository.buscarTodos()
  }

  async buscarPorId(id) {
    const bolao = await this.bolaoRepository.buscarPorId(id)
    if (!bolao) {
      throw new AppError('Bolão não encontrado', 404)
    }
    return bolao
  }

  async criarBolao({ nome, descricao, criador_perfil_id }) {
    if (!nome || !criador_perfil_id) {
      throw new AppError('Nome e criador são obrigatórios', 400)
    }
    await this._verificarPerfilExiste(criador_perfil_id)
    return await this.bolaoRepository.salvar(nome, descricao, criador_perfil_id)
  }

  async atualizarBolao(id, { nome, descricao }) {
    const bolaoAtualizado = await this.bolaoRepository.atualizar(id, nome, descricao)
    if (!bolaoAtualizado) {
      throw new AppError('Bolão não encontrado', 404)
    }
    return bolaoAtualizado
  }

  async deletarBolao(id) {
    const removido = await this.bolaoRepository.remover(id)
    if (!removido) {
      throw new AppError('Bolão não encontrado', 404)
    }
    return { message: 'Bolão removido com sucesso' }
  }

  async adicionarParticipante(bolao_id, perfil_id) {
    await this._verificarPerfilExiste(perfil_id)
    const bolao = await this.buscarPorId(bolao_id)
    
    const existe = await this.bolaoRepository.participanteExiste(bolao_id, perfil_id)
    if (existe) {
      throw new AppError('Perfil já é participante deste bolão', 400)
    }

    await this.bolaoRepository.adicionarParticipante(bolao_id, perfil_id)
    return { message: 'Participante adicionado com sucesso' }
  }
}

export default BolaoService
