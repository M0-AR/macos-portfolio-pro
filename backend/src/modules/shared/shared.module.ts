import { Global, Injectable, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      // DB cold during first boot: controllers degrade to seed/cached data, never 500.
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Injectable()
export class CacheService {
  private readonly log = new Logger(CacheService.name);
  private readonly redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379/0', {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor() {
    this.redis.on('error', (e) => this.log.warn(`redis degraded: ${e.message}`));
  }

  // Cache-aside with single-flight + stale-while-revalidate + jitter.
  // Target hit ratio >80% on hot read endpoints. NEVER cache auth/balances here.
  async cached<T>(key: string, ttlSec: number, loader: () => Promise<T>): Promise<{ data: T; cached: boolean; stale?: boolean }> {
    try {
      const hit = await this.redis.get(key);
      if (hit) return { data: JSON.parse(hit) as T, cached: true };
    } catch {
      /* degraded -> loader */
    }
    const shared = this.inflight.get(key) as Promise<T> | undefined;
    if (shared) {
      try {
        return { data: await shared, cached: true };
      } catch {
        /* fall through to stale */
      }
    }
    const p = loader();
    this.inflight.set(key, p);
    try {
      const data = await p;
      try {
        await this.redis.setex(key, ttlSec + Math.floor(Math.random() * 30), JSON.stringify(data));
      } catch {
        /* best-effort */
      }
      return { data, cached: false };
    } catch (e) {
      try {
        const stale = await this.redis.get(key);
        if (stale) return { data: JSON.parse(stale) as T, cached: true, stale: true };
      } catch {
        /* ignore */
      }
      throw e;
    } finally {
      this.inflight.delete(key);
    }
  }

  async invalidate(prefix: string) {
    try {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length) await this.redis.del(...keys);
    } catch {
      /* best-effort */
    }
  }
}

// Single shared Prisma + Redis wiring.
// Pool guard: keep Prisma pool small (connection_limit=10 in DATABASE_URL),
// let a pooler multiplex when scaling horizontally (see db/init.sql).
@Global()
@Module({
  providers: [PrismaService, CacheService],
  exports: [PrismaService, CacheService],
})
export class SharedModule {}
