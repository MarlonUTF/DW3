// @file: src/models/tarefa.model.js

class TarefaModel {
  constructor() {
    this.tarefas = [
      { id: 1, descricao: "Fazer compras", concluido: false },
      { id: 2, descricao: "Lavar o carro", concluido: false },
      { id: 3, descricao: "Estudar Fastify", concluido: true },
    ];
  }

  async listar(opcoes = {}) {
    console.log("Model: listar chamado");

    const { busca, concluido } = opcoes;

    let resultado = this.tarefas;

    if (busca) {
      resultado = resultado.filter((t) =>
        t.descricao.toLowerCase().includes(busca.toLowerCase()),
      );
    }

    if (concluido !== undefined) {
      const concluidoBool = concluido === "true";
      resultado = resultado.filter((t) => t.concluido === concluidoBool);
    }

    return resultado;
  }

  async criar(descricao) {
    console.log("Model: criar chamado");

    if (!descricao || descricao.trim() === "") {
      throw new Error("A descrição da tarefa é obrigatória");
    }

    const novoId =
      this.tarefas.length > 0
        ? this.tarefas[this.tarefas.length - 1].id + 1
        : 1;

    const novaTarefa = {
      id: novoId,
      descricao,
      concluido: false,
    };

    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }

  async buscarPorId(id) {
    console.log("Model: buscarPorId chamado");

    const tarefa = this.tarefas.find((t) => t.id === id);

    if (!tarefa) {
      throw new Error("Tarefa não encontrada");
    }

    return tarefa;
  }

  async atualizar(id, dadosAtualizados) {
    console.log("Model: atualizar chamado");

    const index = this.tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Tarefa não encontrada");
    }

    this.tarefas[index] = {
      ...this.tarefas[index],
      ...dadosAtualizados,
      id,
    };

    return this.tarefas[index];
  }

  async alternarConcluido(id) {
    console.log("Model: alternarConcluido chamado");

    const index = this.tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Tarefa não encontrada");
    }

    this.tarefas[index].concluido = !this.tarefas[index].concluido;

    return this.tarefas[index];
  }

  async remover(id) {
    console.log("Model: remover chamado");

    const index = this.tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Tarefa não encontrada");
    }

    const tarefaRemovida = this.tarefas.splice(index, 1);

    return tarefaRemovida[0];
  }

  async obterResumo() {
    console.log("Model: obterResumo chamado");

    const total = this.tarefas.length;
    const concluidas = this.tarefas.filter((t) => t.concluido).length;
    const pendentes = total - concluidas;

    return { total, concluidas, pendentes };
  }
}

export default new TarefaModel();
