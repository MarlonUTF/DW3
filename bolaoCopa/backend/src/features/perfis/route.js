import PerfilRepository from './repository.js'
import PerfilService from './service.js'
import PerfilController from './controller.js'
import errorSchema from '../../shared/errorSchema.js'

export default async function perfisRoutes(fastify, options) {
  const repository = new PerfilRepository()
  const service = new PerfilService(repository)
  const controller = new PerfilController(service)

  const perfilSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      nome: { type: 'string' },
      created_at: { type: 'string' }
    }
  }

  fastify.get('/', {
    schema: {
      tags: ['Perfis'],
      response: { 200: { type: 'array', items: perfilSchema } }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Perfis'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: perfilSchema,
        404: { description: 'Perfil não encontrado', ...errorSchema }
      }
    }
  }, controller.buscarPorId)

  fastify.post('/', {
    schema: {
      tags: ['Perfis'],
      body: {
        type: 'object',
        required: ['nome'],
        properties: { nome: { type: 'string' } }
      },
      response: {
        201: perfilSchema,
        400: { description: 'Erro de validação', ...errorSchema }
      }
    }
  }, controller.criar)

  fastify.patch('/:id', {
    schema: {
      tags: ['Perfis'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        required: ['nome'],
        properties: { nome: { type: 'string' } }
      },
      response: {
        200: perfilSchema,
        400: { description: 'Erro de validação', ...errorSchema },
        404: { description: 'Perfil não encontrado', ...errorSchema }
      }
    }
  }, controller.atualizar)

  fastify.delete('/:id', {
    schema: {
      tags: ['Perfis'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: {
          type: 'object',
          properties: { mensagem: { type: 'string' } }
        },
        404: { description: 'Perfil não encontrado', ...errorSchema }
      }
    }
  }, controller.deletar)
}
