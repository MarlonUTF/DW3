import Fastify from 'fastify'
import cors from '@fastify/cors'
import tarefaRoutes from './features/tarefas/tarefa.route.js'
import client from './database/client.js'

const server = Fastify()

await server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

server.register(tarefaRoutes, { prefix: '/tarefas' })

server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    status: 'error',
    message: 'O recurso solicitado não existe nesta API.'
  })
})

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await client.connect()
    console.log('✅ Conectado ao PostgreSQL com sucesso')

    await server.listen({ port: PORT })
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  } catch (erro) {
    console.error('❌ Falha ao iniciar a aplicação:', erro)
    process.exit(1)
  }
}

start()