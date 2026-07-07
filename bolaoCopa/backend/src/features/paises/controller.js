class PaisController {
  constructor(paisService) {
    this.paisService = paisService
  }

  listar = async (req, reply) => {
    return await this.paisService.listarTodos()
  }

  buscarPorId = async (req, reply) => {
    const { id } = req.params
    return await this.paisService.buscarPorId(Number(id))
  }
}

export default PaisController
