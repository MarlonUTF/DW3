class JogoController {
  constructor(jogoService) {
    this.jogoService = jogoService
  }

  listar = async (req, reply) => {
    return await this.jogoService.listarJogos()
  }

  buscarPorId = async (req, reply) => {
    const { id } = req.params
    return await this.jogoService.buscarJogo(Number(id))
  }

  criar = async (req, reply) => {
    const jogo = await this.jogoService.criarJogo(req.body)
    return reply.status(201).send(jogo)
  }

  atualizar = async (req, reply) => {
    const { id } = req.params
    return await this.jogoService.atualizarJogo(Number(id), req.body)
  }

  remover = async (req, reply) => {
    const { id } = req.params
    const resultado = await this.jogoService.removerJogo(Number(id))
    return reply.send(resultado)
  }
}

export default JogoController
