const tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true },
];

// LISTAR
export async function listar(opcoes = {}) {
  console.log("Model: listar chamado");

  const { busca, concluido } = opcoes;

  let resultado = tarefas;

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

// CRIAR
export async function criar(descricao) {
  console.log("Model: criar chamado");

  if (!descricao || descricao.trim() === "") {
    throw new Error("A descrição da tarefa é obrigatória");
  }

  const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;

  const novaTarefa = {
    id: novoId,
    descricao,
    concluido: false,
  };

  tarefas.push(novaTarefa);
  return novaTarefa;
}

// BUSCAR POR ID
export async function buscarPorId(id) {
  console.log("Model: buscarPorId chamado");

  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    throw new Error("Tarefa não encontrada");
  }

  return tarefa;
}

// ATUALIZAR
export async function atualizar(id, dadosAtualizados) {
  console.log("Model: atualizar chamado");

  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Tarefa não encontrada");
  }

  tarefas[index] = {
    ...tarefas[index],
    ...dadosAtualizados,
    id, // garante que o ID não seja alterado
  };

  return tarefas[index];
}

// ALTERNAR CONCLUÍDO
export async function alternarConcluido(id) {
  console.log("Model: alternarConcluido chamado");

  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Tarefa não encontrada");
  }

  tarefas[index].concluido = !tarefas[index].concluido;

  return tarefas[index];
}

// REMOVER
export async function remover(id) {
  console.log("Model: remover chamado");

  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Tarefa não encontrada");
  }

  const tarefaRemovida = tarefas.splice(index, 1);

  return tarefaRemovida[0];
}

// RESUMO
export async function obterResumo() {
  console.log("Model: obterResumo chamado");

  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluido).length;
  const pendentes = total - concluidas;

  return { total, concluidas, pendentes };
}