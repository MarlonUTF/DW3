import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import pool from './database/pool.js'
import errorHandler from './shared/errorHandler.js'
import perfisRoutes from './features/perfis/route.js'
import paisesRoutes from './features/paises/route.js'
import boloesRoutes from './features/boloes/route.js'
import resultadosRoutes from './features/resultados/route.js'
import jogosRoutes from './features/jogos/route.js'
import palpitesRoutes from './features/palpites/route.js'

const server = Fastify({ logger: true })

await server.register(cors, { origin: '*' })

await server.register(swagger, {
  openapi: {
    info: {
      title: 'API Bolão da Copa',
      description: 'API para o Bolão da Copa do Mundo 2026',
      version: '1.0.0'
    }
  }
})

await server.register(swaggerUi, { routePrefix: '/docs' })

server.setErrorHandler(errorHandler)

server.register(perfisRoutes, { prefix: '/perfis' })
server.register(paisesRoutes, { prefix: '/paises' })
server.register(boloesRoutes, { prefix: '/boloes' })
server.register(resultadosRoutes, { prefix: '/resultados' })
server.register(jogosRoutes, { prefix: '/jogos' })
server.register(palpitesRoutes, { prefix: '/palpites' })

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('✅ Conectado ao PostgreSQL')
    await server.listen({ port: PORT })
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  } catch (erro) {
    console.error('❌ Falha ao iniciar:', erro)
    process.exit(1)
  }
}

start()
