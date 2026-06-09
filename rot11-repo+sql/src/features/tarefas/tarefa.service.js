class TarefaService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository
  }

  async listarTodas() {
    return this.tarefaRepository.buscarTodos()
  }

  async buscarPorId(id) {
    const tarefa = await this.tarefaRepository.buscarPorId(id)
    if (!tarefa) {
      throw new Error('Tarefa não encontrada')
    }
    return tarefa
  }

  async criarTarefa(descricao) {
    if (!descricao || descricao.trim() === '') {
      throw new Error('Descrição é obrigatória')
    }
    const novaTarefa = {
      descricao: descricao.trim(),
      concluido: false
    }
    return this.tarefaRepository.salvar(novaTarefa)
  }

  async atualizarTarefa(id, dados) {
    const tarefa = await this.tarefaRepository.buscarPorId(id)
    if (!tarefa) {
      throw new Error('Tarefa não encontrada')
    }

    const tarefaAtualizada = await this.tarefaRepository.atualizar(id, dados)
    if (!tarefaAtualizada) {
      throw new Error('Falha ao atualizar tarefa')
    }
    return tarefaAtualizada
  }

  async deletarTarefa(id) {
    const removido = await this.tarefaRepository.remover(id)
    if (!removido) {
      throw new Error('Tarefa não encontrada')
    }
    return { message: 'Tarefa removida com sucesso' }
  }
}

export default TarefaService