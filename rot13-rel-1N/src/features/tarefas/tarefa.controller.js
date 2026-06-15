class TarefaController {
  constructor(tarefaService) {
    this.tarefaService = tarefaService
  }

  async listar(request, reply) {
    try {
      const { projetoId } = request.query
      const tarefas = await this.tarefaService.listarTodas(projetoId ? Number(projetoId) : null)
      return reply.send(tarefas)
    } catch (error) {
      return reply.status(400).send({ error: error.message })
    }
  }

  async buscarPorId(request, reply) {
    try {
      const { id } = request.params
      const tarefa = await this.tarefaService.buscarPorId(Number(id))
      return reply.send(tarefa)
    } catch (error) {
      return reply.status(404).send({ error: error.message })
    }
  }

  async criar(request, reply) {
    try {
      const { descricao, projetoId } = request.body
      const novaTarefa = await this.tarefaService.criarTarefa({ descricao, projetoId })
      return reply.status(201).send(novaTarefa)
    } catch (error) {
      return reply.status(400).send({ error: error.message })
    }
  }

  async atualizar(request, reply) {
    try {
      const { id } = request.params
      const dados = request.body
      const tarefaAtualizada = await this.tarefaService.atualizarTarefa(Number(id), dados)
      return reply.send(tarefaAtualizada)
    } catch (error) {
      return reply.status(404).send({ error: error.message })
    }
  }

  async deletar(request, reply) {
    try {
      const { id } = request.params
      const resultado = await this.tarefaService.deletarTarefa(Number(id))
      return reply.send(resultado)
    } catch (error) {
      return reply.status(404).send({ error: error.message })
    }
  }
}

export default TarefaController