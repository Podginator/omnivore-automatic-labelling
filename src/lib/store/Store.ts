import { LocalLabelStore } from './labelLocal'
import { LabelDynamoDBStore } from './labelDynamoDBStore'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export interface Store<T> {
  get(): Promise<T[]>
  put(val: T): Promise<void>
}

export const store = (() => {
  const localStore = new LocalLabelStore()
  if (process.env.DYNAMODB_TABLE_NAME != undefined) {
    return new LabelDynamoDBStore(localStore, new DynamoDBClient())
  }

  return localStore
})()
