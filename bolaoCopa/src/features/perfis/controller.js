class PerfilController {
  constructor(perfilService) {
    this.perfilService = perfilService
  }

  async listar(request, reply) {
    const perfis = await this.perfilService.listarTodos()
    return reply.send(perfis)
  }

  async buscarPorId(request, reply) {
    const { id } = request.params
    const perfil = await this.perfilService.buscarPorId(Number(id))
    return reply.send(perfil)
  }

  async criar(request, reply) {
    const dados = request.body
    const novoPerfil = await this.perfilService.criarPerfil(dados)
    return reply.status(201).send(novoPerfil)
  }

  async atualizar(request, reply) {
    const { id } = request.params
    const dados = request.body
    const perfilAtualizado = await this.perfilService.atualizarPerfil(Number(id), dados)
    return reply.send(perfilAtualizado)
  }

  async deletar(request, reply) {
    const { id } = request.params
    const resultado = await this.perfilService.deletarPerfil(Number(id))
    return reply.send(resultado)
  }
}

export default PerfilController
