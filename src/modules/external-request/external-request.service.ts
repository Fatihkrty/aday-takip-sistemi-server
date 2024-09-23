import type { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';

import { NotFoundError } from '@/error/NotFound';
import { UnprocessableError } from '@/error/Unprocessable';

import paginate from '@/utils/paginate';
import { zodBaseString } from '@/utils/zod';
import { like } from '@/utils/prisma-filter';

import { ExternalRequestScheme, ExternalRequestQueryScheme } from './external-request.scheme';

export const getExternalRequests = async (req: FastifyRequest) => {
  const query = ExternalRequestQueryScheme.parse(req.query);
  const where: Prisma.ExternalRequestWhereInput = {};

  if (query.filters) {
    const { filters } = query;

    if (filters.email) {
      where.company = {
        email: like(filters.email),
      };
    }

    if (filters.name) {
      where.company = {
        ...where.company,
        name: like(filters.name) as any,
      };
    }

    if (filters.sector) {
      where.company = {
        ...where.company,
        sector: like(filters.sector) as any,
      };
    }

    if (filters.isActive) {
      if (filters.isActive === 'true') {
        where.isActive = true;
      } else {
        where.isActive = false;
      }
    }
  }

  const [total, docs] = await Promise.all([
    prisma.externalRequest.count({ where }),
    prisma.externalRequest.findMany({
      where,
      include: {
        company: { select: { id: true, name: true, email: true, sector: true } },
      },
      take: query.limit,
      skip: query.page * query.limit,
    }),
  ]);

  return paginate(docs, query, total);
};

export const checkExternalRequest = async (req: FastifyRequest) => {
  const code = zodBaseString.parse((req.params as any).code);

  const externalReq = await prisma.externalRequest.findUnique({
    where: { code },
  });

  if (!externalReq) {
    throw new NotFoundError('Talep bulunamadı');
  }

  if (!externalReq.isActive) {
    throw new UnprocessableError('Talep daha önce doldurulmuş veya süresi dolmuş');
  }
};

export const createExternalRequest = async (req: FastifyRequest) => {
  const code = zodBaseString.parse((req.params as any).code);

  const externalReq = await prisma.externalRequest.findUnique({
    where: { code },
  });

  if (!externalReq) {
    throw new NotFoundError('Talep bulunamadı');
  }

  if (!externalReq.isActive) {
    throw new UnprocessableError('Talep daha önce doldurulmuş veya süresi dolmuş');
  }

  const body = ExternalRequestScheme.parse(req.body);

  const resp = await prisma.$transaction(async (tx) => {
    let positionId: number | undefined;

    if (body.position) {
      const resp = await tx.position.upsert({
        where: { name: body.position },
        create: { name: body.position },
        update: {},
      });
      positionId = resp.id;
    }

    await tx.externalRequest.update({
      where: { id: externalReq.id },
      data: { isActive: false },
    });

    return tx.request.create({
      data: {
        ...body,
        positionId,
        status: 'open',
        isExternal: true,
        position: undefined,
        companyId: externalReq.companyId,
      },
    });
  });

  (async () => {
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true },
    });

    prisma.notification
      .createMany({
        data: adminUsers.map((x) => ({
          isReaded: false,
          userId: x.id,
          message: `#${resp.id} numaralı yeni bir dış firma talebi mevcut`,
        })),
      })
      .then(() => {})
      .catch(() => {});
  })();
};
