import PalpiteRepository from './repository.js'
import PalpiteService from './service.js'
import PalpiteController from './controller.js'
import JogoRepository from '../jogos/repository.js'
import BolaoRepository from '../boloes/repository.js'

const jogoRepository = new JogoRepository()
const bolaoRepository = new BolaoRepository()
const repository = new PalpiteRepository()
const service = new PalpiteService(repository, jogoRepository, bolaoRepository)
const controller = new PalpiteController(service)

async function palpitesRoutes(fastify, options) {
  fastify.post('/', {
    schema: {
      tags: ['Palpites'],
      body: { type: 'object' }
    }
  }, controller.criar.bind(controller))

  fastify.patch('/:id', {
    schema: {
      tags: ['Palpites'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: { type: 'object' }
    }
  }, controller.atualizar.bind(controller))

  fastify.delete('/:id', {
    schema: {
      tags: ['Palpites'],
      params: { type: 'object', properties: { id: { type: 'integer' } } }
    }
  }, controller.remover.bind(controller))
}

export default palpitesRoutes
