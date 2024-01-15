import { Context } from 'aws-cdk/lib/settings'
import { PageWebhookInput } from './types/Webhook'
import { retrieveSimilarLabelsForPage } from './lib/service/page'
import { logger } from './lib/util/logger'

export const handler = async (
  event: PageWebhookInput,
  _: Context,
): Promise<void> => {
  logger.log(`Retrieved Page: ${event.page.title}, Trying to get Labels...`)
  logger.log(JSON.stringify(event))
  if (event.page.state != 'SUCCEEDED' || event.action != 'updated') {
    logger.error('Not able to parse an incomplete article, exiting early...')
    return
  }
  await retrieveSimilarLabelsForPage(event.page)
}
