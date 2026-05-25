import Fastify from 'fastify'
import cors from '@fastify/cors'

import tarefaRoutes from './routes/tarefa.routes.js'
import TarefaRepository from './repositories/tarefa.repository.js'
import TarefaService from './services/tarefa.service.js'
import TarefaController from './controllers/tarefa.controller.js'

const server = Fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

// Composition Root
const repository = new TarefaRepository()
const service = new TarefaService(repository)
const controller = new TarefaController(service)

server.register(tarefaRoutes, { controller })

const PORT = 3000
server.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})