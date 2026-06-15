import TarefaRepository from './tarefa.repository.js'
import TarefaService from './tarefa.service.js'
import TarefaController from './tarefa.controller.js'

const repository = new TarefaRepository()
const service = new TarefaService(repository)
const controller = new TarefaController(service)

async function tarefaRoutes(fastify, options) {
  fastify.get('/', controller.listar.bind(controller))
  fastify.get('/:id', controller.buscarPorId.bind(controller))
  fastify.post('/', controller.criar.bind(controller))
  fastify.patch('/:id', controller.atualizar.bind(controller))
  fastify.delete('/:id', controller.deletar.bind(controller))
}

export default tarefaRoutes