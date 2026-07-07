import PaisRepository from './repository.js'
import PaisService from './service.js'
import PaisController from './controller.js'
import errorSchema from '../../shared/errorSchema.js'

export default async function paisesRoutes(fastify, options) {
  const repository = new PaisRepository()
  const service = new PaisService(repository)
  const controller = new PaisController(service)

  const paisSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      nome: { type: 'string' },
      sigla_fifa: { type: 'string' },
      bandeira_url: { type: 'string', nullable: true },
      grupo_id: { type: 'integer', nullable: true },
      grupo_nome: { type: 'string', nullable: true }
    }
  }

  fastify.get('/', {
    schema: {
      tags: ['Países'],
      response: { 200: { type: 'array', items: paisSchema } }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Países'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: paisSchema,
        404: { description: 'País não encontrado', ...errorSchema }
      }
    }
  }, controller.buscarPorId)
}
