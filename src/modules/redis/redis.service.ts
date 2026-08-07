// cache.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getVersion(scope: string, suffix: string): Promise<number> {
    const v = await this.redis.get(`version:${scope}:${suffix}`);
    // đặt mặc định là về 0 => bởi vì ở đây là redis bản chất chưa có key này
    // lúc tăng incr lên thì là 1 => lại trả về key 1 nếu ở đây trả về default 1
    // return v ? Number(v) : 1;
    return v ? Number(v) : 0;
  }

  // Tăng version
  async bumpVersion(scope: string, suffix: string): Promise<void> {
    await this.redis.incr(`version:${scope}:${suffix}`);
  }

  // Build cache key cho chi tiết từng thằng kể cả detail
  //=> scope => suffix > version detail
  async buildKey(scope: string, suffix: string): Promise<string> {
    const version = await this.getVersion(scope, suffix);
    return `${scope}:${suffix}:v${version}`;
  }

  async get<T>(scope: string, suffix: string): Promise<T | null> {
    const key = await this.buildKey(scope, suffix);
    const data = await this.redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set(
    scope: string,
    suffix: string,
    value: unknown,
    ttlSeconds = 30,
  ): Promise<void> {
    const key = await this.buildKey(scope, suffix);
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
