import config from '@/config';

import prisma from '@/services/prisma';
import server from '@/services/fastify';
import startSeed from '@/services/seeder';
import redisClient from '@/services/redis';

// Load Routes

import '@/modules/auth/auth.routes';
import '@/modules/autocomplete/autocomplete.routes';
import '@/modules/candidate/candidate.routes';
import '@/modules/company/company.routes';
import '@/modules/dashboard/dashboard.routes';
import '@/modules/external-request/external-request.routes';
import '@/modules/notification/notification.routes';
import '@/modules/referral/referral.routes';
import '@/modules/request/request.routes';
import '@/modules/upload/upload.routes';
import '@/modules/user/user.routes';

redisClient.on('connect', async () => {
  try {
    console.info('Redis Connected');

    await prisma.$connect();
    console.info('Database Connected');

    await startSeed();

    server.listen({ port: config.app.port }, (error, address) => {
      if (error) throw error;
      console.info('Server started: ', address);
    });
  } catch (error) {
    throw error;
  }
});

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
  throw error;
});

process.on('SIGINT', (signal) => {
  console.warn('SIGNAL', signal);
  redisClient.disconnect();
  process.exit(0);
});

console.log(`Process ID: ${process.pid}`);
