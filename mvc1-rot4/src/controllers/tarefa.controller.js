// @file: src/ROUTES/tarefa.routes.js
import {
  listar,
  criar,
  buscarPorId,
  atualizar,
  alternarConcluido,
  remover,
  obterResumo,
} from "../models/tarefa.model.js";

// Processa requisições da rota `GET /tarefas`
export async function listarTarefas(request, reply) {
  // LOG para indicar que a função foi chamada
  console.log("Controller: listarTarefas chamado");

  const { busca, concluido = false } = request.query;

  /* ------------------------------------------------------------------------------
   * Lógica de manipulação dos dados                                               |
   * Chama a função do modelo para obter as tarefas, passando as opções de filtro  |
   * Como a função no modelo é `async`, usamos `await` para aguardar o resultado   |
   * ------------------------------------------------------------------------------*/
  //
  const resultado = await listar({ busca, concluido });
  /* ------------------------------------------------------------------------ */

  return reply.status(200).send(resultado);
}

// Processa requisições da rota `POST /tarefas`
export async function criarTarefa(request, reply) {
  console.log("Controller: criarTarefa chamado");
  const { descricao } = request.body;
  const resultado = await criar(descricao);
  return reply.status(201).send(resultado);
}

// Processa requisições da rota `GET /tarefas/resumo`
export async function obterResumo(request, reply) {
  console.log("Controller: obterResumo chamado");
  const resultado = await obterResumo();
  return reply.status(200).send(resultado);
}

// Processa requisições da rota `GET /tarefas/:id`
export async function obterTarefa(request, reply) {
  console.log("Controller: obterTarefa chamado");
  const id = Number(request.params.id);
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  reply.send(tarefa);
}

// Processa requisições da rota `PATCH /tarefas/:id`
export async function atualizarTarefa(request, reply) {
  console.log("Controller: atualizarTarefa chamado");
  const id = Number(request.params.id);
  const index = tarefas.findIndex((t) => t.id === id);
  if (index === -1) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }
  const tarefaAtualizada = request.body;
  tarefas[index] = { ...tarefas[index], ...tarefaAtualizada, id };

  return reply.send(tarefas[index]);
}

// Processa requisições da rota `PATCH /tarefas/:id/concluir`
export async function concluirTarefa(request, reply) {
  console.log("Controller: concluirTarefa chamado");
  const id = Number(request.params.id);
  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  tarefas[index].concluido = !tarefas[index].concluido;
  return reply.send(tarefas[index]);
}

// Processa requisições da rota `DELETE /tarefas/:id`
export async function removerTarefa(request, reply) {
  console.log("Controller: removerTarefa chamado");
  const id = Number(request.params.id);
  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  tarefas.splice(index, 1);
  return reply.status(204).send();
}
