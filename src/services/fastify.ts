import QueryString from 'qs';
import fastify from 'fastify';
import config from '@/config';
import { ZodError } from 'zod';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifySession from '@mgcrea/fastify-session';
import RedisStore from '@mgcrea/fastify-session-redis-store';

import redisClient from '@/services/redis';

import HttpError from '@/error/HttpError';

const server = fastify({
  logger: config.app.isDev,
  querystringParser(str) {
    return QueryString.parse(str);
  },
});

server.register(fastifyCookie);

server.register(fastifyMultipart);

server.register(fastifySession, {
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient, ttl: config.session.expireTime }),
  secret: config.session.secret,
  cookie: { maxAge: config.session.expireTime },
});

server.register(fastifyCors, {
  origin: (origin, cb) => {
    cb(null, true);
  },
  credentials: true,
});

// Error Handling
server.setErrorHandler((error, _, res) => {
  console.log(error);

  if (error instanceof ZodError) {
    res.status(400).send(
      error.errors.map((err) => ({
        path: err.path[0],
        message: err.message,
      }))
    );
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).send({ message: error.message });
    return;
  }

  res.status(500).send({ message: 'Bilinmeyen bir hata oluştu' });
});

export default server;
