import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expireAt: number;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, value: T, ageInMs: number) {
    const expireAt = Date.now() + ageInMs;
    this.cache.set(key, { value, expireAt });
  }

  get<T>(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expireAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }
}
