import ResultadoRepository from './repository.js'
import ResultadoService from './service.js'
import ResultadoController from './controller.js'

const repository = new ResultadoRepository()
const service = new ResultadoService(repository)
const controller = new ResultadoController(service)

async function resultadosRoutes(fastify, options) {
  fastify.post('/', {
    schema: {
      tags: ['Resultados'],
      body: {
        type: 'object',
        required: ['jogo_id', 'gols_casa', 'gols_fora'],
        properties: {
          jogo_id: { type: 'integer' },
          gols_casa: { type: 'integer' },
          gols_fora: { type: 'integer' },
          vencedor_id: { type: 'integer' }
        }
      }
    }
  }, controller.criar.bind(controller))

  fastify.patch('/:id', {
    schema: {
      tags: ['Resultados'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        properties: {
          gols_casa: { type: 'integer' },
          gols_fora: { type: 'integer' },
          vencedor_id: { type: 'integer' }
        }
      }
    }
  }, controller.atualizar.bind(controller))
}

export default resultadosRoutes
