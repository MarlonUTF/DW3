import AppError from '../../shared/AppError.js'

class PerfilService {
  constructor(perfilRepository) {
    this.perfilRepository = perfilRepository
  }

  async listarTodos() {
    return await this.perfilRepository.buscarTodos()
  }

  async buscarPorId(id) {
    const perfil = await this.perfilRepository.buscarPorId(id)
    if (!perfil) {
      throw new AppError('Perfil não encontrado', 404)
    }
    return perfil
  }

  async criarPerfil({ nome }) {
    if (!nome || nome.trim() === '') {
      throw new AppError('Nome é obrigatório', 400)
    }
    return await this.perfilRepository.salvar(nome.trim())
  }

  async atualizarPerfil(id, { nome }) {
    if (!nome || nome.trim() === '') {
      throw new AppError('Nome é obrigatório', 400)
    }
    const perfilAtualizado = await this.perfilRepository.atualizar(id, nome.trim())
    if (!perfilAtualizado) {
      throw new AppError('Perfil não encontrado', 404)
    }
    return perfilAtualizado
  }

  async deletarPerfil(id) {
    const removido = await this.perfilRepository.remover(id)
    if (!removido) {
      throw new AppError('Perfil não encontrado', 404)
    }
    return { message: 'Perfil removido com sucesso' }
  }
}

export default PerfilService
