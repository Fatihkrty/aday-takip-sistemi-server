import type { RedisOptions } from 'ioredis';

import { resolve } from 'path';
import { config as configDotenv } from 'dotenv';

const appConfig = configDotenv({
  path: resolve(__dirname, '..', '..', `.env`),
});

if (appConfig.error) {
  throw appConfig.error;
}

const config = {
  app: {
    isDev: process.env.NODE_ENV === 'dev',
    port: parseInt(process.env.PORT || '4242'),
    domain: process.env.DOMAIN,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  } as RedisOptions,
  session: {
    secret: process.env.SESSION_SECRET!,
    expireTime: parseInt(process.env.SESSION_EXP || '43200'),
  },
  minio: {
    host: process.env.MINIO_HOST || 'localhost',
    port: parseInt(process.env.MINIO_API_PORT || '9000'),
    accessKey: process.env.MINIO_ROOT_USER || 'ats',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'ats_minio_123',
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '0'),
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: process.env.MAIL_SECURE === 'true',
    from: process.env.MAIL_FROM,
  },
};

export default config;
