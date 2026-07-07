class ResultadoController {
  constructor(resultadoService) {
    this.resultadoService = resultadoService
  }

  listar = async (req, reply) => {
    return await this.resultadoService.listarTodos()
  }

  buscarPorId = async (req, reply) => {
    const { id } = req.params
    return await this.resultadoService.buscarPorId(Number(id))
  }

  criar = async (req, reply) => {
    const novoResultado = await this.resultadoService.criarResultado(req.body)
    return reply.status(201).send(novoResultado)
  }

  atualizar = async (req, reply) => {
    const { id } = req.params
    const resultadoAtualizado = await this.resultadoService.atualizarResultado(Number(id), req.body)
    return reply.send(resultadoAtualizado)
  }

  remover = async (req, reply) => {
    const { id } = req.params
    const resultado = await this.resultadoService.removerResultado(Number(id))
    return reply.send(resultado)
  }
}

export default ResultadoController
