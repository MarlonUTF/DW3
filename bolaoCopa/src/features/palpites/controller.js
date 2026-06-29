class PalpiteController {
  constructor(palpiteService) {
    this.palpiteService = palpiteService
  }

  async criar(request, reply) {
    const palpite = await this.palpiteService.criar(request.body)
    return reply.status(201).send(palpite)
  }

  async atualizar(request, reply) {
    const { id } = request.params
    const palpite = await this.palpiteService.atualizar(Number(id), request.body)
    return reply.send(palpite)
  }

  async remover(request, reply) {
    const { id } = request.params
    await this.palpiteService.remover(Number(id))
    return reply.status(204).send()
  }
}

export default PalpiteController
