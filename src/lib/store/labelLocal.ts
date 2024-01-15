import { Store } from './Store'
import { Label } from '../../types/OmnivoreSchema'
import { Embedded } from '../../types/Embedded'
import { Cache } from '../util/cache'

export class LocalLabelStore implements Store<Embedded<Label>> {
  private cache: Cache<Embedded<Label>>

  constructor() {
    this.cache = new Cache<Embedded<Label>>([], (label) => label.base.name)
  }

  async get(): Promise<Embedded<Label>[]> {
    return this.cache.getAll()
  }

  async put(val: Embedded<Label>): Promise<void> {
    this.cache.putVal(val)
  }
}
