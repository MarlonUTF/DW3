import PerfilRepository from './repository.js'
import PerfilService from './service.js'
import PerfilController from './controller.js'

const repository = new PerfilRepository()
const service = new PerfilService(repository)
const controller = new PerfilController(service)

async function perfisRoutes(fastify, options) {
  fastify.get('/', {
    schema: {
      tags: ['Perfis'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              nome: { type: 'string' },
              created_at: { type: 'string' }
            }
          }
        }
      }
    }
  }, controller.listar.bind(controller))

  fastify.get('/:id', {
    schema: {
      tags: ['Perfis'],
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            created_at: { type: 'string' }
          }
        }
      }
    }
  }, controller.buscarPorId.bind(controller))

  fastify.post('/', {
    schema: {
      tags: ['Perfis'],
      body: {
        type: 'object',
        required: ['nome'],
        properties: { nome: { type: 'string' } }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            created_at: { type: 'string' }
          }
        }
      }
    }
  }, controller.criar.bind(controller))

  fastify.patch('/:id', {
    schema: {
      tags: ['Perfis'],
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } }
      },
      body: {
        type: 'object',
        required: ['nome'],
        properties: { nome: { type: 'string' } }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            created_at: { type: 'string' }
          }
        }
      }
    }
  }, controller.atualizar.bind(controller))

  fastify.delete('/:id', {
    schema: {
      tags: ['Perfis'],
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } }
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } }
        }
      }
    }
  }, controller.deletar.bind(controller))
}

export default perfisRoutes
