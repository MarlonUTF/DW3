class BolaoController {
  constructor(bolaoService) {
    this.bolaoService = bolaoService
  }

  listar = async (req, reply) => {
    return await this.bolaoService.listarTodos()
  }

  buscarPorId = async (req, reply) => {
    const { id } = req.params
    return await this.bolaoService.buscarPorId(Number(id))
  }

  criar = async (req, reply) => {
    const novoBolao = await this.bolaoService.criarBolao(req.body)
    return reply.status(201).send(novoBolao)
  }

  atualizar = async (req, reply) => {
    const { id } = req.params
    const bolaoAtualizado = await this.bolaoService.atualizarBolao(Number(id), req.body)
    return reply.send(bolaoAtualizado)
  }

  deletar = async (req, reply) => {
    const { id } = req.params
    const resultado = await this.bolaoService.deletarBolao(Number(id))
    return reply.send(resultado)
  }

  listarParticipantes = async (req, reply) => {
    const { id } = req.params
    return await this.bolaoService.listarParticipantes(Number(id))
  }

  adicionarParticipante = async (req, reply) => {
    const { id: bolao_id } = req.params
    const { perfil_id } = req.body
    const resultado = await this.bolaoService.adicionarParticipante(Number(bolao_id), perfil_id)
    return reply.send(resultado)
  }
}

export default BolaoController
