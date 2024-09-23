import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

import { UnauthorizedError } from '@/error/Unauthorization';

export const authMiddleware = (
  req: FastifyRequest,
  _res: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const userId = req.session.get('userId');

  if (!userId) {
    return done(new UnauthorizedError('Önce giriş yapın'));
  }
  done();
};
