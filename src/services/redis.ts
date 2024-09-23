import config from '@/config';
import { Redis } from 'ioredis';

const redisClient = new Redis(config.redis);

export async function destroyUserSession(userId: number) {
  const keys = await redisClient.keys(`session:${userId}:*`);
  if (keys.length) {
    return redisClient.del(keys);
  }
}

export default redisClient;
