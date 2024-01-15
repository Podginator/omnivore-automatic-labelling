export class Cache<T> {
  private cache: Map<string, T>
  readonly storeByFunction: ((obj: T) => string) | undefined

  constructor(
    cachedElements: T[] = [],
    storeFn: ((obj: T) => string) | undefined = undefined,
  ) {
    this.cache = new Map<string, T>()
    this.storeByFunction = storeFn

    cachedElements.forEach((it) => this.putVal(it))
  }

  get(key: string): T | undefined {
    return this.cache.get(key)
  }

  getAll(): T[] {
    return [...this.cache.values()]
  }
  put(key: string, val: T): void {
    this.cache.set(key, val)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  putVal(val: T): void {
    if (!this.storeByFunction) {
      throw new Error(
        'No store function, cannot save values. Try using put(key, val)',
      )
    }

    this.cache.set(this.storeByFunction(val), val)
  }
}
