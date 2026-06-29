class PaisController {
  constructor(paisService) {
    this.paisService = paisService
  }

  async listar(request, reply) {
    const paises = await this.paisService.listarTodos()
    return reply.send(paises)
  }

  async buscarPorId(request, reply) {
    const { id } = request.params
    const pais = await this.paisService.buscarPorId(Number(id))
    return reply.send(pais)
  }
}

export default PaisController
