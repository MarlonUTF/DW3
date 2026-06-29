import AppError from '../../shared/AppError.js'

class PaisService {
  constructor(paisRepository) {
    this.paisRepository = paisRepository
  }

  async listarTodos() {
    return await this.paisRepository.buscarTodos()
  }

  async buscarPorId(id) {
    const pais = await this.paisRepository.buscarPorId(id)
    if (!pais) {
      throw new AppError('País não encontrado', 404)
    }
    return pais
  }
}

export default PaisService
