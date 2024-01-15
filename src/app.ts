import fastify, { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import * as webhook from './routes/webhook'

export const app = fastify()

webhook.registerRoutes(app)

// Error Handling - Uses http-errors
app.setErrorHandler((err: FastifyError, _req, reply) => {
  if (!err) {
    return reply.status(500).send()
  }

  if (err.statusCode) {
    return reply.status(err.statusCode).send(err)
  }

  return reply.status(500).send(err)
})

if (require.main === module) {
  app.listen(3000, (err) => {
    console.log('Listening on Port 3000')
  })
}
