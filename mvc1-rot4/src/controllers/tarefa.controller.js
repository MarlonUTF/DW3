import {
  listar,
  criar,
  buscarPorId,
  atualizar,
  alternarConcluido,
  remover,
  obterResumo as obterResumoModel,
} from "../models/tarefa.model.js";

// GET /tarefas
export async function listarTarefas(request, reply) {
  console.log("Controller: listarTarefas chamado");

  try {
    const { busca, concluido } = request.query;
    const resultado = await listar({ busca, concluido });

    return reply.status(200).send(resultado);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

// POST /tarefas
export async function criarTarefa(request, reply) {
  console.log("Controller: criarTarefa chamado");

  try {
    const { descricao } = request.body;
    const resultado = await criar(descricao);

    return reply.status(201).send(resultado);
  } catch (error) {
    return reply.status(400).send({ error: error.message });
  }
}

// GET /tarefas/resumo
export async function obterResumo(request, reply) {
  console.log("Controller: obterResumo chamado");

  try {
    const resultado = await obterResumoModel();
    return reply.status(200).send(resultado);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

// GET /tarefas/:id
export async function obterTarefa(request, reply) {
  console.log("Controller: obterTarefa chamado");

  try {
    const id = Number(request.params.id);
    const tarefa = await buscarPorId(id);

    return reply.send(tarefa);
  } catch (error) {
    return reply.status(404).send({ error: error.message });
  }
}

// PATCH /tarefas/:id
export async function atualizarTarefa(request, reply) {
  console.log("Controller: atualizarTarefa chamado");

  try {
    const id = Number(request.params.id);
    const dados = request.body;

    const tarefa = await atualizar(id, dados);

    return reply.send(tarefa);
  } catch (error) {
    return reply.status(404).send({ error: error.message });
  }
}

// PATCH /tarefas/:id/concluir
export async function concluirTarefa(request, reply) {
  console.log("Controller: concluirTarefa chamado");

  try {
    const id = Number(request.params.id);
    const tarefa = await alternarConcluido(id);

    return reply.send(tarefa);
  } catch (error) {
    return reply.status(404).send({ error: error.message });
  }
}

// DELETE /tarefas/:id
export async function removerTarefa(request, reply) {
  console.log("Controller: removerTarefa chamado");

  try {
    const id = Number(request.params.id);

    await remover(id);

    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({ error: error.message });
  }
}