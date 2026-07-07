const errorSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    message: { type: 'string' }
  }
}

export default errorSchema
