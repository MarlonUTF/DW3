import BolaoRepository from './repository.js'
import BolaoService from './service.js'
import BolaoController from './controller.js'

const repository = new BolaoRepository()
const service = new BolaoService(repository)
const controller = new BolaoController(service)

async function boloesRoutes(fastify, options) {
  fastify.get('/', {
    schema: {
      tags: ['Bolões'],
      response: { 200: { type: 'array', items: { type: 'object' } } }
    }
  }, controller.listar.bind(controller))

  fastify.get('/:id', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } }
    }
  }, controller.buscarPorId.bind(controller))

  fastify.post('/', {
    schema: {
      tags: ['Bolões'],
      body: {
        type: 'object',
        required: ['nome', 'criador_perfil_id'],
        properties: { 
          nome: { type: 'string' },
          descricao: { type: 'string' },
          criador_perfil_id: { type: 'integer' }
        }
      }
    }
  }, controller.criar.bind(controller))

  fastify.patch('/:id', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        required: ['nome'],
        properties: { nome: { type: 'string' }, descricao: { type: 'string' } }
      }
    }
  }, controller.atualizar.bind(controller))

  fastify.delete('/:id', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } }
    }
  }, controller.deletar.bind(controller))

  fastify.post('/:id/participantes', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        required: ['perfil_id'],
        properties: { perfil_id: { type: 'integer' } }
      }
    }
  }, controller.adicionarParticipante.bind(controller))
}

export default boloesRoutes
