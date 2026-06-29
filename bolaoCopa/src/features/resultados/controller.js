class ResultadoController {
  constructor(resultadoService) {
    this.resultadoService = resultadoService
  }

  async criar(request, reply) {
    const novoResultado = await this.resultadoService.criarResultado(request.body)
    return reply.status(201).send(novoResultado)
  }

  async atualizar(request, reply) {
    const { id } = request.params
    const resultadoAtualizado = await this.resultadoService.atualizarResultado(Number(id), request.body)
    return reply.send(resultadoAtualizado)
  }
}

export default ResultadoController
