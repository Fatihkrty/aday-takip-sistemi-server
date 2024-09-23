import type { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';

import { NotFoundError } from '@/error/NotFound';

import { zodId } from '@/utils/zod';
import paginate from '@/utils/paginate';
import { like } from '@/utils/prisma-filter';

import { RequestScheme, ReuestQueryScheme, ChangeRequestStatusScheme } from './request.scheme';

export const getRequests = async (req: FastifyRequest) => {
  const query = ReuestQueryScheme.parse(req.query);

  const where: Prisma.RequestWhereInput = {};
  let orderBy: Prisma.RequestOrderByWithRelationInput | undefined;

  if (query.filters) {
    const { filters } = query;

    if (filters.id !== undefined) {
      where.id = filters.id;
    }

    if (filters.companyName !== undefined) {
      where.company = {
        name: like(filters.companyName),
      };
    }

    if (filters.department !== undefined) {
      where.department = like(filters.department);
    }

    if (filters.workerReqCount !== undefined) {
      where.workerReqCount = filters.workerReqCount;
    }

    if (filters.jobDescription !== undefined) {
      where.jobDescription = like(filters.jobDescription);
    }

    if (filters.description !== undefined) {
      where.description = like(filters.description);
    }

    if (filters.requiredQualifications !== undefined) {
      where.requiredQualifications = like(filters.requiredQualifications);
    }

    if (filters.salary !== undefined) {
      where.salary = filters.salary;
    }

    if (filters.prim !== undefined) {
      where.prim = filters.prim;
    }

    if (filters.workType !== undefined) {
      where.workType = {
        hasEvery: filters.workType,
      };
    }

    if (filters.companyWorkType !== undefined) {
      where.companyWorkType = filters.companyWorkType;
    }

    if (filters.workDays !== undefined) {
      where.workDays = {
        hasEvery: filters.workDays,
      };
    }

    if (filters.workHourStart !== undefined) {
      where.workHourStart = filters.workHourStart;
    }

    if (filters.workHourEnd !== undefined) {
      where.workHourEnd = filters.workHourEnd;
    }

    if (filters.advisorName !== undefined) {
      where.advisorName = like(filters.advisorName);
    }

    if (filters.advisorPhone !== undefined) {
      where.advisorPhone = like(filters.advisorPhone);
    }

    if (filters.advisorEmail !== undefined) {
      where.advisorEmail = like(filters.advisorEmail);
    }

    if (filters.advisorTitle !== undefined) {
      where.advisorTitle = like(filters.advisorTitle);
    }

    if (filters.sideRights !== undefined) {
      where.sideRights = {
        hasEvery: filters.sideRights,
      };
    }

    if (filters.gender !== undefined) {
      where.gender = filters.gender === 'null' ? null : filters.gender;
    }

    if (filters.militaryService !== undefined) {
      where.militaryService = filters.militaryService === 'null' ? null : filters.militaryService;
    }

    if (filters.status !== undefined) {
      where.status = filters.status;
    }

    if (filters.positionName !== undefined) {
      where.position = {
        name: like(filters.positionName),
      };
    }

    if (filters.userName !== undefined) {
      where.user = {
        name: like(filters.userName),
      };
    }

    if (filters.userId !== undefined) {
      where.user = {
        id: filters.userId,
      };
    }

    if (filters.isExternal !== undefined) {
      where.isExternal = filters.isExternal;
    }

    if (filters.candidateId?.length) {
      where.referrals = {
        some: {
          candidateId: {
            in: filters.candidateId,
          },
        },
      };
    }
  }

  if (query.sorting) {
    const { id, desc } = query.sorting;
    orderBy = {
      [id]: desc ? 'desc' : 'asc',
    };
  }

  const [total, resp] = await Promise.all([
    prisma.request.count({ where }),
    prisma.request.findMany({
      where,
      orderBy,
      include: {
        company: {
          select: { id: true, name: true },
        },
        position: true,
        user: {
          select: { id: true, name: true },
        },
        referrals: true,
      },
    }),
  ]);

  return paginate(resp, query, total);
};

export const getRequest = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      company: {
        select: { id: true, name: true },
      },
      referrals: true,
      position: true,
      user: {
        select: { id: true, name: true },
      },
    },
  });

  return request;
};

export const createRequest = async (req: FastifyRequest) => {
  const body = RequestScheme.parse(req.body);

  let positionId: number | undefined;

  if (body.position) {
    const resp = await prisma.position.upsert({
      where: { name: body.position },
      create: { name: body.position },
      update: {},
    });
    positionId = resp.id;
  }

  const resp = await prisma.request.create({
    data: {
      ...body,
      positionId,
      status: 'open',
      isExternal: false,
      position: undefined,
    },
  });

  if (body.userId) {
    prisma.notification
      .create({
        data: {
          isReaded: false,
          userId: body.userId,
          message: `#${resp.id} numaralı yeni bir firma talebi mevcut`,
        },
      })
      .then(() => {})
      .catch(() => {});
  }
};

export const updateRequest = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);
  const body = RequestScheme.partial().parse(req.body);

  const request = await prisma.request.findUnique({ where: { id } });
  let positionId = request?.positionId;

  if (!request) {
    throw new NotFoundError('Talep bulunamadı');
  }

  if (body.position) {
    const resp = await prisma.position.upsert({
      where: { name: body.position },
      create: { name: body.position },
      update: {},
    });
    positionId = resp.id;
  }

  await prisma.request.update({
    where: { id: request.id },
    data: {
      ...body,
      positionId,
      position: undefined,
    },
  });

  if (body.userId && body.userId !== request.userId) {
    prisma.notification
      .create({
        data: {
          isReaded: false,
          userId: body.userId,
          message: `#${request.id} numaralı yeni bir firma talebi mevcut`,
        },
      })
      .then(() => {})
      .catch(() => {});
  }
};

export const allowRequest = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const request = await prisma.request.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!request) {
    throw new NotFoundError('Talep bulunamadı');
  }

  await prisma.request.update({
    where: { id: request.id },
    data: { isExternal: false },
  });
};

export const changeStatusRequest = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);
  const body = ChangeRequestStatusScheme.parse(req.body);

  const request = await prisma.request.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!request) {
    throw new NotFoundError('Talep bulunamadı');
  }

  if (request.status === body.status) {
    return;
  }

  await prisma.request.update({
    where: { id: request.id },
    data: { status: body.status, closedAt: body.status === 'open' ? null : new Date() },
  });
};
