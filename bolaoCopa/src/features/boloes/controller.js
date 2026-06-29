class BolaoController {
  constructor(bolaoService) {
    this.bolaoService = bolaoService
  }

  async listar(request, reply) {
    const boloes = await this.bolaoService.listarTodos()
    return reply.send(boloes)
  }

  async buscarPorId(request, reply) {
    const { id } = request.params
    const bolao = await this.bolaoService.buscarPorId(Number(id))
    return reply.send(bolao)
  }

  async criar(request, reply) {
    const dados = request.body
    const novoBolao = await this.bolaoService.criarBolao(dados)
    return reply.status(201).send(novoBolao)
  }

  async atualizar(request, reply) {
    const { id } = request.params
    const dados = request.body
    const bolaoAtualizado = await this.bolaoService.atualizarBolao(Number(id), dados)
    return reply.send(bolaoAtualizado)
  }

  async deletar(request, reply) {
    const { id } = request.params
    const resultado = await this.bolaoService.deletarBolao(Number(id))
    return reply.send(resultado)
  }

  async adicionarParticipante(request, reply) {
    const { id: bolao_id } = request.params
    const { perfil_id } = request.body
    const resultado = await this.bolaoService.adicionarParticipante(Number(bolao_id), perfil_id)
    return reply.send(resultado)
  }
}

export default BolaoController
