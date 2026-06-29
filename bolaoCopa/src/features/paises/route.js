import PaisRepository from './repository.js'
import PaisService from './service.js'
import PaisController from './controller.js'

const repository = new PaisRepository()
const service = new PaisService(repository)
const controller = new PaisController(service)

async function paisesRoutes(fastify, options) {
  fastify.get('/', {
    schema: {
      tags: ['Países'],
      response: { 200: { type: 'array', items: { type: 'object' } } }
    }
  }, controller.listar.bind(controller))

  fastify.get('/:id', {
    schema: {
      tags: ['Países'],
      params: { type: 'object', properties: { id: { type: 'integer' } } }
    }
  }, controller.buscarPorId.bind(controller))
}

export default paisesRoutes
