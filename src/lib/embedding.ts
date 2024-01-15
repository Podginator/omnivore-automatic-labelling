import { cosineSimilarity, normalizeValue } from './util/math'
import { Embedded } from '../types/Embedded'
import { Label } from '../types/OmnivoreSchema'
import { OmnivorePage } from '../types/Webhook'
import { SELECTION_CONFIG } from '../resources/config'
import { logger } from './util/logger'


const getPercentageSimilarity = (
    labelProbability: { label: Label; similarity: number }[],
): Label[] => {
  const percentages = SELECTION_CONFIG.percentages!

  for (const config of percentages) {
    logger.log(config.percentage)

    const labels = labelProbability.filter(
        (it) => it.similarity > config.percentage,
    )

    logger.log(labels)
    if (labels.length > 0) {
      return labels.slice(0, config.maxLabels).map((it) => it.label)
    }
  }

  return []
}

const getHighestProbability = (
    labelProbability: { label: Label; similarity: number }[],
): Label[] =>
    labelProbability
        .slice(0, SELECTION_CONFIG.maxLabels ?? 1)
        .map((it) => it.label)

const getPerTag = (
    labelProbability: { label: Label; similarity: number }[],
): Label[] => {
  const labelMap = SELECTION_CONFIG.labels!

  return labelProbability
      .filter(
          (it) =>
              labelMap[it.label.name] != undefined &&
              labelMap[it.label.name] < it.similarity,
      )
      .map((it) => it.label)
}

const filterIfNotInSet = (() => {
  const selectionSet = new Set<string>(SELECTION_CONFIG.filters)
  return (label: { label: Label }) => {
    return !selectionSet.has(label.label.name)
  }
})()

const LABEL_SELECTION_MAP = {
  'PERCENTAGES': getPercentageSimilarity,
  'HIGHEST_SIMILARITY': getHighestProbability,
  'PER_LABEL_PERCENTAGE': getPerTag,
}

export const getSimilarLabels = (
  article: Embedded<OmnivorePage>,
  labelEmbeddings: Embedded<Label>[],
): Label[] => {
  const labelSimilarity = labelEmbeddings
    .map((it) => {
      // OpenAI Embeddings are a little weird, and they seem to normalise AROUND 0.7-0.8. We normalise these so we can have a bit
      // more normal looking percentages.
      const similarityScore = normalizeValue(
        0.71,
        0.8,
        cosineSimilarity(article.embedding, it.embedding),
      )

      return {
        label: it.base,
        similarity: similarityScore,
      }
    })
    .filter(filterIfNotInSet)
    .sort((a, b) => b.similarity - a.similarity)

  logger.log('Similarity')
  logger.log(JSON.stringify(labelSimilarity))


  logger.log(`Using Label Selection Method ${SELECTION_CONFIG.labelSelectionType}`)
  return LABEL_SELECTION_MAP[SELECTION_CONFIG.labelSelectionType.toString()](labelSimilarity)
}
