class TarefaService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository
  }

  // Mapeia os campos planos (projeto_id, projeto_nome) para um objeto "projeto"
  _formatarTarefa(tarefa) {
    if (!tarefa) return null
    const { projeto_id, projeto_nome, ...resto } = tarefa
    return {
      ...resto,
      projeto: {
        id: projeto_id,
        nome: projeto_nome || null
      }
    }
  }

  async listarTodas(projetoId = null) {
    const tarefas = await this.tarefaRepository.buscarTodos(projetoId)
    return tarefas.map(t => this._formatarTarefa(t))
  }

  async buscarPorId(id) {
    const tarefa = await this.tarefaRepository.buscarPorId(id)
    if (!tarefa) {
      throw new Error('Tarefa não encontrada')
    }
    return this._formatarTarefa(tarefa)
  }

  async criarTarefa({ descricao, projetoId }) {
    if (!descricao || descricao.trim() === '') {
      throw new Error('Descrição é obrigatória')
    }
    if (!projetoId) {
      throw new Error('Projeto é obrigatório')
    }

    const novaTarefa = {
      descricao: descricao.trim(),
      concluido: false,
      projetoId
    }

    const tarefaSalva = await this.tarefaRepository.salvar(novaTarefa)
    return this._formatarTarefa(tarefaSalva)
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
    return this._formatarTarefa(tarefaAtualizada)
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