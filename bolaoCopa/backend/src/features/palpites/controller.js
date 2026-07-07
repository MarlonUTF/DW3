class PalpiteController {
  constructor(palpiteService) {
    this.palpiteService = palpiteService
  }

  listar = async (req, reply) => {
    return await this.palpiteService.listarTodos()
  }

  buscarPorId = async (req, reply) => {
    const { id } = req.params
    return await this.palpiteService.buscarPorId(Number(id))
  }

  criar = async (req, reply) => {
    const palpite = await this.palpiteService.criarPalpite(req.body)
    return reply.status(201).send(palpite)
  }

  atualizar = async (req, reply) => {
    const { id } = req.params
    const palpite = await this.palpiteService.atualizarPalpite(Number(id), req.body)
    return reply.send(palpite)
  }

  remover = async (req, reply) => {
    const { id } = req.params
    await this.palpiteService.removerPalpite(Number(id))
    return reply.status(204).send()
  }
}

export default PalpiteController
