import { OmnivorePage } from '../types/Webhook'
import { Embedded } from '../types/Embedded'
import { client as aiClient } from '../clients/ai/client'

export const getArticleEmbedding = async (
  article: OmnivorePage,
): Promise<Embedded<OmnivorePage>> => {
  const articleTitleAndDescription = `${article.title}: ${article.description}`
  const embedding = await aiClient.getEmbeddings(articleTitleAndDescription)

  return {
    base: article,
    embedding: embedding,
  }
}
