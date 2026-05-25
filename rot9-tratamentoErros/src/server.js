import Fastify from 'fastify'
import cors from '@fastify/cors'
import tarefaRoutes from './features/tarefas/tarefa.routes.js'
import { AppError } from './errors/AppError.js'

const server = Fastify({ logger: true })

await server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

server.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    })
  }

  console.error('ERRO INTERNO:', error)

  return reply.status(500).send({
    status: 'error',
    message: 'Internal Server Error'
  })
})

server.register(tarefaRoutes)

const start = async () => {
  await server.listen({ port: 3000 })
}

start()