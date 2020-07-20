import '../extantions/array.extansion';

class DbCacheEntry<T> {
  constructor(public idx: string) {
    this.elements = [];
  }
  public elements: T[];
}

export class DbCache {

  constructor() {
    this.cache = [];
  }

  protected cache;

  public addToCache<T>(idx: string, elementsToAdd: T | T[]) {

    if (elementsToAdd === null)
      return;

    const cacheHit = this.cache.find((x) => x.idx === idx);
    if (cacheHit !== undefined) {
      cacheHit.elements.pushRange(elementsToAdd);
      // remove dubs
      cacheHit.elements.filter((value, index, array) => array.indexOf(value) === index);
    } else {
      const entry = new DbCacheEntry<T>(idx);

      const c = elementsToAdd.constructor;
      if (elementsToAdd.constructor === Array) {
        entry.elements = elementsToAdd as T[];
      } else {
        entry.elements.push(elementsToAdd as T);
      }
      this.cache.push(entry);
    }
  }

  public findInCache<T>(idx: string, elementFinder?: (value: T, index: number, obj: T[]) => boolean): T {
    const cacheHit = this.cache.find((x) => x.idx === idx);
    if (cacheHit !== undefined) {
      if (elementFinder !== undefined) {
        return cacheHit.elements.find(elementFinder) as T;
      } else {
        if (cacheHit.elements.length > 0)
          return cacheHit.elements[0] as T;
      }
    }
    return undefined;
  }

  public findInCacheElements<T>(idx: string, elementsCount: number): T[] {
    if (this.hasCacheEnoughElements(idx, elementsCount)) {
      return this.cache.find((x) => x.idx === idx).elements.slice(0, elementsCount) as T[];
    } else {
      return undefined;
    }
  }

  public hasCacheEnoughElements(idx: string, needElements: number): boolean {
    const cacheHit = this.cache.find((x) => x.idx === idx);
    if (cacheHit === undefined) { return false; }
    return cacheHit.elements.length >= needElements;
  }
}

export class CacheName {
  public static Currencies = 'currencies';
  public static PricePair = 'price:';
}
