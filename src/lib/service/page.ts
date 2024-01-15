import { getArticleEmbedding } from '../article'
import { getEmbeddedLabels } from '../labels'
import { getSimilarLabels } from '../embedding'
import { omnivoreClient } from '../../clients/omnivore/omnivore'
import { OmnivorePage } from '../../types/Webhook'
import { logger } from '../util/logger'

export const retrieveSimilarLabelsForPage = async (
  omnivorePage: OmnivorePage,
): Promise<void> => {
  const client = await omnivoreClient
  logger.log('Retrieving Article Embeddings...')
  const articleEmbedding = await getArticleEmbedding(omnivorePage)
  logger.log('Retrieving Label Embeddings...')
  const labelEmbeddings = await getEmbeddedLabels()

  logger.log('Calculating Label Similiarities...')
  const similarLabels = getSimilarLabels(articleEmbedding, labelEmbeddings)

  await client.setLabels(articleEmbedding.base.id, similarLabels)
}
