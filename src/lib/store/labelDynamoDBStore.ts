import { Store } from './Store'
import { LocalLabelStore } from './labelLocal'
import { Embedded } from '../../types/Embedded'
import { Label } from '../../types/OmnivoreSchema'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import { logger } from '../util/logger'

export class LabelDynamoDBStore implements Store<Embedded<Label>> {
  private localStore: LocalLabelStore
  private dynamoDbClient: DynamoDBClient
  private docClient: DynamoDBDocumentClient

  constructor(local: LocalLabelStore, dynamoDClient: DynamoDBClient) {
    this.localStore = local
    this.dynamoDbClient = dynamoDClient
    this.docClient = DynamoDBDocumentClient.from(dynamoDClient)
  }

  async get(): Promise<Embedded<Label>[]> {
    const locallyStored = await this.localStore.get()
    if (locallyStored.length) {
      return locallyStored
    }

    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
    })

    logger.log('Retrieving Label Embeddings from DynamoDB')
    const response = await this.docClient.send(command)
    return (response.Items ?? []).map((it) => ({
      base: {
        name: it.name,
        description: it.description,
        id: it.id,
      },
      embedding: it.embedding,
    })) as Embedded<Label>[]
  }

  async put(val: Embedded<Label>): Promise<void> {
    await this.localStore.put(val)

    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        id: val.base.id,
        description: val.base.description,
        name: val.base.name,
        embedding: val.embedding,
      },
    })

    await this.docClient.send(command)
  }
}
