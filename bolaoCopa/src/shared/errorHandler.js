import AppError from './AppError.js'

export default function errorHandler(error, request, reply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    })
  }

  if (error.validation) {
    return reply.status(400).send({
      status: 'error',
      message: 'Erro de validação',
      details: error.validation
    })
  }

  console.error(error)
  return reply.status(500).send({
    status: 'error',
    message: 'Erro interno do servidor'
  })
}
