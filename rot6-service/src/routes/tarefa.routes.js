export default async function tarefaRoutes(server, options) {
  const { controller } = options

  server.get('/tarefas', (request, reply) => {
    console.log("Routes: GET /tarefas chamada")
    return controller.listarTarefas(request, reply)
  })

  server.post('/tarefas', (request, reply) => {
    console.log("Routes: POST /tarefas chamada")
    return controller.criarTarefa(request, reply)
  })

  server.get('/tarefas/resumo', (request, reply) => {
    console.log("Routes: GET /tarefas/resumo chamada")
    return controller.obterResumo(request, reply)
  })

  // Novo endpoint: pendentes (deve vir antes de /:id)
  server.get('/tarefas/pendentes', (request, reply) => {
    console.log("Routes: GET /tarefas/pendentes chamada")
    return controller.obterPendentes(request, reply)
  })

  server.get('/tarefas/:id', (request, reply) => {
    console.log("Routes: GET /tarefas/:id chamada")
    return controller.obterTarefa(request, reply)
  })

  server.patch('/tarefas/:id', (request, reply) => {
    console.log("Routes: PATCH /tarefas/:id chamada")
    return controller.atualizarTarefa(request, reply)
  })

  server.patch('/tarefas/:id/concluir', (request, reply) => {
    console.log("Routes: PATCH /tarefas/:id/concluir chamada")
    return controller.concluirTarefa(request, reply)
  })

  server.delete('/tarefas/:id', (request, reply) => {
    console.log("Routes: DELETE /tarefas/:id chamada")
    return controller.removerTarefa(request, reply)
  })
}