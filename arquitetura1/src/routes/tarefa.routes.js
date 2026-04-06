

const tarefas = [
    { id: 1, descricao: "Fazer compras", concluido: false },
    { id: 2, descricao: "Lavar o carro", concluido: false },
    { id: 3, descricao: "Estudar Fastify", concluido: true }
]

export async function tarefaRoutes(server) {

  // GET com filtros combinados (busca + concluido)
  server.get("/", async (request, reply) => {
    const { busca, concluido } = request.query;

    let resultado = tarefas;

    if (busca) {
      resultado = resultado.filter((t) =>
        t.descricao.toLowerCase().includes(busca.toLowerCase()),
      );
    }

    if (concluido !== undefined) {
      resultado = resultado.filter(
        (t) => String(t.concluido) === String(concluido),
      );
    }

    return reply.send(resultado);
  });

  // POST com validação
  server.post("/", async (request, reply) => {
    const { descricao, concluido = false } = request.body;

    if (!descricao || descricao.trim() === "") {
      return reply.status(400).send({
        status: "error",
        message: "A descrição é obrigatória",
      });
    }

    const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;
    const novaTarefa = { id: novoId, descricao, concluido };

    tarefas.push(novaTarefa);

    return reply.status(201).send(novaTarefa);
  });

  // GET por ID
  server.get("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const tarefa = tarefas.find((t) => t.id === id);

    if (!tarefa) {
      return reply.status(404).send({
        status: "error",
        message: "Tarefa não encontrada",
      });
    }

    return reply.send(tarefa);
  });

  // PATCH padrão
  server.patch("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return reply.status(404).send({
        status: "error",
        message: "Tarefa não encontrada",
      });
    }

    tarefas[index] = { ...tarefas[index], ...request.body, id };

    return reply.send(tarefas[index]);
  });

  // PATCH toggle concluir
  server.patch("/:id/concluir", async (request, reply) => {
    const id = Number(request.params.id);
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return reply.status(404).send({
        status: "error",
        message: "Tarefa não encontrada",
      });
    }

    tarefas[index].concluido = !tarefas[index].concluido;

    return reply.send(tarefas[index]);
  });

  // DELETE
  server.delete("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return reply.status(404).send({
        status: "error",
        message: "Tarefa não encontrada",
      });
    }

    tarefas.splice(index, 1);

    return reply.status(204).send();
  });

  // GET resumo
  server.get("/resumo", async (request, reply) => {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluido).length;
    const pendentes = total - concluidas;

    return reply.send({
      total,
      concluidas,
      pendentes,
    });
  });
}
