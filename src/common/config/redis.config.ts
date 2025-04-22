import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';

export const redisConfig: CacheModuleAsyncOptions = {
  useFactory: async () => {
    const redisStore = new KeyvRedis(process.env.REDIS_URI);

    return { stores: [new Keyv({ store: redisStore, ttl: 5 * 60 * 1000 })] };
  },
};
