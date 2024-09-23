import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';

import { zodId } from '@/utils/zod';
import { BaseQuerySchema } from '@/utils/validation/base-query.schema';

export const getNotifications = async (req: FastifyRequest) => {
  const userId = req.session.get('userId') as number;
  const query = BaseQuerySchema.parse(req.query);

  const notifications = await prisma.notification.findMany({
    where: { userId: userId },
    orderBy: { id: 'desc' },
    take: query.limit,
    skip: query.page * query.limit,
  });

  return notifications;
};

export const markAsReadNotification = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);
  const userId = req.session.get('userId') as number;

  try {
    await prisma.notification.update({
      where: { id, userId: userId },
      data: { isReaded: true },
    });
  } catch {}
};
