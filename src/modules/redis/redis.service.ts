// cache.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

type ScopePart = string | number | object;
type Scope = ScopePart | ScopePart[];

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private normalizeScope(scope: Scope): string {
    const parts = Array.isArray(scope) ? scope : [scope];
    return parts
      .map((p) => (typeof p === 'object' ? JSON.stringify(p) : String(p)))
      .join(':');
  }

  async getVersionScope(scope: Scope): Promise<number> {
    const key = this.normalizeScope(scope);
    const v = await this.redis.get(`versionSC:${key}`);
    return v ? Number(v) : 0;
  }

  async bumpVersionScope(scope: Scope): Promise<void> {
    const key = this.normalizeScope(scope);
    await this.redis.incr(`versionSC:${key}`);
  }

  async buildKey(scope: Scope): Promise<string> {
    const key = this.normalizeScope(scope);
    const scopeVersion = await this.getVersionScope(scope);
    return `${key}:v${scopeVersion}`;
  }

  async get<T>(scope: Scope): Promise<T | null> {
    const key = await this.buildKey(scope);
    const data = await this.redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set(
    scope: Scope,
    value: unknown,
    ttlSeconds = 30,
  ): Promise<void> {
    const key = await this.buildKey(scope);
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}