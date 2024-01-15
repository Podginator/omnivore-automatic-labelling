import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PageWebhookInput } from '../types/Webhook'
import { retrieveSimilarLabelsForPage } from '../lib/service/page'
import { logger } from '../lib/util/logger'

const putLabelsOnArticle = async (
  req: FastifyRequest<{ Body: PageWebhookInput }>,
  res: FastifyReply,
): Promise<void> => {
  const webhookInput = req.body
  try {
    await retrieveSimilarLabelsForPage(webhookInput.page)
  } catch (e) {
    logger.error(`Unable to retrieve similar logos, exiting: ${e.toString()}`)
    throw e
  }
  res.status(200)
}

export function registerRoutes(app: FastifyInstance): void {
  app.post<{ Body: PageWebhookInput }>('/page', {}, putLabelsOnArticle)
}
