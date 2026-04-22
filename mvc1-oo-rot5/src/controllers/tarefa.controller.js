// @file: src/controllers/tarefa.controller.js
import model from "../models/tarefa.model.js";

class TarefaController {
  constructor() {
    this.model = model;
  }

  async listarTarefas(request, reply) {
    console.log("Controller: listarTarefas chamado");

    try {
      const { busca, concluido } = request.query;
      const resultado = await this.model.listar({ busca, concluido });

      return reply.status(200).send(resultado);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }

  async criarTarefa(request, reply) {
    console.log("Controller: criarTarefa chamado");

    try {
      const { descricao } = request.body;
      const resultado = await this.model.criar(descricao);

      return reply.status(201).send(resultado);
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async obterResumo(request, reply) {
    console.log("Controller: obterResumo chamado");

    try {
      const resultado = await this.model.obterResumo();
      return reply.status(200).send(resultado);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }

  async obterTarefa(request, reply) {
    console.log("Controller: obterTarefa chamado");

    try {
      const id = Number(request.params.id);
      const tarefa = await this.model.buscarPorId(id);

      return reply.send(tarefa);
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async atualizarTarefa(request, reply) {
    console.log("Controller: atualizarTarefa chamado");

    try {
      const id = Number(request.params.id);
      const dados = request.body;

      const tarefa = await this.model.atualizar(id, dados);

      return reply.send(tarefa);
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async concluirTarefa(request, reply) {
    console.log("Controller: concluirTarefa chamado");

    try {
      const id = Number(request.params.id);
      const tarefa = await this.model.alternarConcluido(id);

      return reply.send(tarefa);
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async removerTarefa(request, reply) {
    console.log("Controller: removerTarefa chamado");

    try {
      const id = Number(request.params.id);

      await this.model.remover(id);

      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ error: error.message });
    }
  }
}

export default new TarefaController();
