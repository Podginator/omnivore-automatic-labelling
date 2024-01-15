import { Embedded } from '../types/Embedded'
import { Label } from '../types/OmnivoreSchema'
import { omnivoreClient } from '../clients/omnivore/omnivore'
import { client as aiClient } from '../clients/ai/client'
import { store } from '../lib/store/Store'

export const getEmbeddedLabels = async (): Promise<Embedded<Label>[]> => {
  const storedEmbeddings = await store.get()

  if (storedEmbeddings.length > 0) {
    return storedEmbeddings
  }

  // Otherwise, we need to go get the labels.
  const labels = (await getUserLabels()).filter((it) => it.name != 'RSS')
  const embeddings = await embedLabels(labels)

  await Promise.all(embeddings.map((it) => store.put(it)))

  return embeddings
}

const embedLabels = async (labels: Label[]): Promise<Embedded<Label>[]> => {
  const embeddings = labels.map((it) =>
    aiClient.getEmbeddings(`${it.name}: ${it.description}`),
  )
  const embedded = await Promise.all(embeddings)

  return labels.reduce(
    (acc: Embedded<Label>[], currentValue: Label, currentIndex: number) => {
      return [...acc, { base: currentValue, embedding: embedded[currentIndex] }]
    },
    [] as Embedded<Label>[],
  )
}

const getUserLabels = async (): Promise<Label[]> =>
  omnivoreClient.then((client) => client.getUsersTags())
