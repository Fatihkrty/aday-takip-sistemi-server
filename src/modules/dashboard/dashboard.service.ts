import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';

export const getDashboardInfo = async (req: FastifyRequest) => {
  const userId = req.session.get('userId') as number;

  const [open, closed, cancelled, myOpen, myClosed, myCancelled] = await Promise.all([
    prisma.request.count({ where: { status: 'open' } }),
    prisma.request.count({ where: { status: 'closed' } }),
    prisma.request.count({ where: { status: 'cancelled' } }),
    prisma.request.count({ where: { userId: userId, status: 'open' } }),
    prisma.request.count({ where: { userId: userId, status: 'closed' } }),
    prisma.request.count({ where: { userId: userId, status: 'cancelled' } }),
  ]);

  return {
    total: {
      open,
      closed,
      cancelled,
    },
    my: {
      open: myOpen,
      closed: myClosed,
      cancelled: myCancelled,
    },
  };
};

export const getCompanyStatus = async () => {
  const response = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { request: true },
      },
    },
    orderBy: { request: { _count: 'desc' } },
    take: 5,
  });

  return response.map((x) => ({ id: x.id, name: x.name, requestCount: x._count.request }));
};
