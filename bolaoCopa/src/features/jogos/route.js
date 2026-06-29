import JogoRepository from './repository.js'
import JogoService from './service.js'
import JogoController from './controller.js'

export default async function (fastify, opts) {
  const repository = new JogoRepository()
  const service = new JogoService(repository)
  const controller = new JogoController(service)

  fastify.get('/', {
    schema: {
      tags: ['Jogos'],
      response: { 200: { type: 'array', items: { type: 'object' } } }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Jogos'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: { 200: { type: 'object' } }
    }
  }, controller.buscarPorId)

  fastify.post('/', {
    schema: {
      tags: ['Jogos'],
      body: { type: 'object', required: ['numero_jogo', 'fase', 'data_hora'], properties: { numero_jogo: { type: 'integer' }, fase: { type: 'string' }, data_hora: { type: 'string' } } },
      response: { 201: { type: 'object' } }
    }
  }, controller.criar)

  fastify.put('/:id', {
    schema: {
      tags: ['Jogos'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: { type: 'object' },
      response: { 200: { type: 'object' } }
    }
  }, controller.atualizar)

  fastify.delete('/:id', {
    schema: {
      tags: ['Jogos'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: { 200: { type: 'object' } }
    }
  }, controller.remover)
}
