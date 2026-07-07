import AppError from './AppError.js'

// Error Handler Global — captura tudo que os Services lançam
// (via AppError) e também erros nativos do driver `pg` que
// eventualmente escapem, padronizando sempre a resposta JSON.
export default function errorHandler(error, request, reply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    })
  }

  // Erro de validação de schema do Fastify (body/params inválidos)
  if (error.validation) {
    return reply.status(400).send({
      status: 'error',
      message: 'Erro de validação',
      details: error.validation
    })
  }

  // Postgres: violação de UNIQUE
  if (error.code === '23505') {
    return reply.status(400).send({
      status: 'error',
      message: 'Já existe um registro com esse valor único'
    })
  }

  // Postgres: violação de FOREIGN KEY
  if (error.code === '23503') {
    return reply.status(400).send({
      status: 'error',
      message: 'Registro relacionado não encontrado ou vinculado (violação de chave estrangeira)'
    })
  }

  // Postgres: violação de CHECK
  if (error.code === '23514') {
    return reply.status(400).send({
      status: 'error',
      message: 'Valor inválido para um dos campos (violação de restrição)'
    })
  }

  request.log.error(error)
  return reply.status(500).send({
    status: 'error',
    message: 'Erro interno do servidor'
  })
}
