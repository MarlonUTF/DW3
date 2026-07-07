import PalpiteRepository from './repository.js'
import PalpiteService from './service.js'
import PalpiteController from './controller.js'
import JogoRepository from '../jogos/repository.js'
import BolaoRepository from '../boloes/repository.js'
import errorSchema from '../../shared/errorSchema.js'

export default async function palpitesRoutes(fastify, options) {
  const palpiteRepo = new PalpiteRepository()
  const jogoRepo = new JogoRepository()
  const bolaoRepo = new BolaoRepository()
  const service = new PalpiteService(palpiteRepo, jogoRepo, bolaoRepo)
  const controller = new PalpiteController(service)

  const palpiteSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      perfil_id: { type: 'integer' },
      bolao_id: { type: 'integer' },
      jogo_id: { type: 'integer' },
      gols_casa: { type: 'integer' },
      gols_fora: { type: 'integer' },
      pontuacao_obtida: { type: 'integer' },
      perfil_nome: { type: 'string' },
      bolao_nome: { type: 'string' },
      numero_jogo: { type: 'integer' },
      fase: { type: 'string' },
      pais_casa_nome: { type: 'string', nullable: true },
      pais_fora_nome: { type: 'string', nullable: true },
      created_at: { type: 'string' }
    }
  }

  fastify.get('/', {
    schema: {
      tags: ['Palpites'],
      response: { 200: { type: 'array', items: palpiteSchema } }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Palpites'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: palpiteSchema,
        404: { description: 'Palpite não encontrado', ...errorSchema }
      }
    }
  }, controller.buscarPorId)

  fastify.post('/', {
    schema: {
      tags: ['Palpites'],
      body: {
        type: 'object',
        required: ['perfil_id', 'bolao_id', 'jogo_id', 'gols_casa', 'gols_fora'],
        properties: {
          perfil_id: { type: 'integer' },
          bolao_id: { type: 'integer' },
          jogo_id: { type: 'integer' },
          gols_casa: { type: 'integer' },
          gols_fora: { type: 'integer' }
        }
      },
      response: {
        201: palpiteSchema,
        400: { description: 'Erro de validação, jogo encerrado ou palpite duplicado', ...errorSchema },
        404: { description: 'Jogo, bolão ou perfil não encontrado', ...errorSchema }
      }
    }
  }, controller.criar)

  fastify.patch('/:id', {
    schema: {
      tags: ['Palpites'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        properties: {
          gols_casa: { type: 'integer' },
          gols_fora: { type: 'integer' }
        }
      },
      response: {
        200: palpiteSchema,
        400: { description: 'Jogo encerrado', ...errorSchema },
        404: { description: 'Palpite não encontrado', ...errorSchema }
      }
    }
  }, controller.atualizar)

  fastify.delete('/:id', {
    schema: {
      tags: ['Palpites'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        204: { type: 'null', description: 'Palpite removido com sucesso' },
        400: { description: 'Jogo encerrado', ...errorSchema },
        404: { description: 'Palpite não encontrado', ...errorSchema }
      }
    }
  }, controller.remover)
}
