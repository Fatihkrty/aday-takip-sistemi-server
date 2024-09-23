import type { UserRoles } from '@prisma/client';
import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

import { ForbiddenError } from '@/error/Forbidden';

export const roleMiddleware =
  (role: UserRoles) => (req: FastifyRequest, _res: FastifyReply, done: HookHandlerDoneFunction) => {
    const userRole = req.session.get('role');

    if (userRole !== role) {
      return done(new ForbiddenError('Yetkisiz işlem'));
    }
    done();
  };
