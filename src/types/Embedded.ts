import { Embedding } from './AiClient'

export type Embedded<T> = {
  base: T
  embedding: Embedding
}
