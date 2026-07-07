class PerfilController {
  constructor(perfilService) {
    this.perfilService = perfilService
  }

  listar = async (req, reply) => {
    return await this.perfilService.listarTodos()
  }

  buscarPorId = async (req, reply) => {
    const { id } = req.params
    return await this.perfilService.buscarPorId(Number(id))
  }

  criar = async (req, reply) => {
    const novoPerfil = await this.perfilService.criarPerfil(req.body)
    return reply.status(201).send(novoPerfil)
  }

  atualizar = async (req, reply) => {
    const { id } = req.params
    const perfilAtualizado = await this.perfilService.atualizarPerfil(Number(id), req.body)
    return reply.send(perfilAtualizado)
  }

  deletar = async (req, reply) => {
    const { id } = req.params
    const resultado = await this.perfilService.deletarPerfil(Number(id))
    return reply.send(resultado)
  }
}

export default PerfilController
