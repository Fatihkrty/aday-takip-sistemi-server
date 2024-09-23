import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';

import { NotFoundError } from '@/error/NotFound';

import { zodId } from '@/utils/zod';
import paginate from '@/utils/paginate';
import { BaseQuerySchema } from '@/utils/validation/base-query.schema';

import { CreateReferralSchema } from './referral.schema';

export const getReferrals = async (req: FastifyRequest) => {
  const query = BaseQuerySchema.parse(req.query);

  const [total, resp] = await Promise.all([
    prisma.referral.count(),
    prisma.referral.findMany({
      select: {
        id: true,
        status: true,
        description: true,
        createdAt: true,
        candidateId: true,
        requestId: true,
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            positions: { select: { position: { select: { id: true, name: true } } } },
          },
        },
        request: {
          select: {
            id: true,
            closedAt: true,
            workerReqCount: true,
            company: { select: { id: true, name: true, location: true, sector: true } },
          },
        },
      },
      orderBy: {
        candidateId: 'desc',
      },
      take: query.limit,
      skip: query.page * query.limit,
    }),
  ]);

  return paginate(resp, query, total);
};

export const createReferral = async (req: FastifyRequest) => {
  const body = CreateReferralSchema.parse(req.body);

  const [candidate, request] = await Promise.all([
    prisma.candidate.findUnique({ where: { id: body.candidateId }, select: { id: true } }),
    prisma.request.findUnique({ where: { id: body.requestId }, select: { id: true } }),
  ]);

  if (!candidate) {
    throw new NotFoundError(`${body.candidateId} numaralı aday bulunamadı`);
  }

  if (!request) {
    throw new NotFoundError(`${body.requestId} numaralı talep bulunamadı`);
  }

  const referral = await prisma.referral.findFirst({
    where: { candidateId: body.candidateId, requestId: body.requestId },
    select: { id: true },
  });

  if (referral) {
    await prisma.referral.update({ where: { id: referral.id }, data: body });
  } else {
    await prisma.referral.create({ data: body });
  }
};

export const deleteReferral = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const referral = await prisma.referral.findUnique({ where: { id }, select: { id: true } });

  if (!referral) {
    throw new NotFoundError('Yönlendirme bulunamadı');
  }

  await prisma.referral.delete({ where: { id: referral.id } });
};
