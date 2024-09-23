import type { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';

import paginate from '@/utils/paginate';
import { like } from '@/utils/prisma-filter';

import {
  AutocompleteQuerySchema,
  CreateAutocompleteSchema,
  AutocompleteSearchQuerySchema,
} from './autocomplete.schema';

export const searchUser = async (req: FastifyRequest) => {
  const params = AutocompleteSearchQuerySchema.parse(req.query);

  if (!params.name) {
    return;
  }

  const response = await prisma.user.findMany({
    where: {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
    },
    select: { id: true, name: true },
    take: 30,
  });

  return response;
};

export const searchCompany = async (req: FastifyRequest) => {
  const params = AutocompleteSearchQuerySchema.parse(req.query);

  if (!params.name) {
    return;
  }

  const response = await prisma.company.findMany({
    where: {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
    },
    select: { id: true, name: true },
    take: 30,
  });

  return response;
};

export const searchLocation = async (req: FastifyRequest) => {
  const params = AutocompleteSearchQuerySchema.parse(req.query);

  if (!params.name) {
    return;
  }

  const response = await prisma.location.findMany({
    where: {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
    },
    select: { id: true, name: true },
    take: 30,
  });

  return response.map((x) => x.name);
};

export const searchPosition = async (req: FastifyRequest) => {
  const params = AutocompleteSearchQuerySchema.parse(req.query);

  if (!params.name) {
    return;
  }

  const response = await prisma.position.findMany({
    where: {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
    },
    select: { id: true, name: true },
    take: 30,
  });

  return response.map((x) => x.name);
};

export const searchSector = async (req: FastifyRequest) => {
  const params = AutocompleteSearchQuerySchema.parse(req.query);

  if (!params.name) {
    return;
  }

  const response = await prisma.sector.findMany({
    where: {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
    },
    select: { id: true, name: true },
    take: 30,
  });

  return response.map((x) => x.name);
};

export const getLocations = async (req: FastifyRequest) => {
  const query = AutocompleteQuerySchema.parse(req.query);

  const where: Prisma.LocationWhereInput = {};
  let orderBy: Prisma.LocationOrderByWithRelationInput | undefined;

  if (query.filters) {
    const { id, name } = query.filters;

    if (name !== undefined) {
      where.name = like(name);
    }

    if (id !== undefined) {
      where.id = id;
    }
  }

  if (query.sorting) {
    const { id, desc } = query.sorting;
    orderBy = {
      [id]: desc ? 'desc' : 'asc',
    };
  }

  const [total, docs] = await Promise.all([
    prisma.location.count({ where }),
    prisma.location.findMany({
      where,
      orderBy,
      take: query.limit,
      skip: query.page * query.limit,
    }),
  ]);

  return paginate(docs, query, total);
};

export const createLocation = async (req: FastifyRequest) => {
  const body = CreateAutocompleteSchema.parse(req.body);

  const isDefined = await prisma.location.findUnique({ where: { name: body.name } });

  if (isDefined) {
    return;
  }

  await prisma.location.create({ data: body });
};

export const getPositions = async (req: FastifyRequest) => {
  const query = AutocompleteQuerySchema.parse(req.query);

  const where: Prisma.PositionWhereInput = {};
  let orderBy: Prisma.PositionOrderByWithRelationInput | undefined;

  if (query.filters) {
    const { id, name } = query.filters;

    if (name !== undefined) {
      where.name = like(name);
    }

    if (id !== undefined) {
      where.id = id;
    }
  }

  if (query.sorting) {
    const { id, desc } = query.sorting;
    orderBy = {
      [id]: desc ? 'desc' : 'asc',
    };
  }

  const [total, docs] = await Promise.all([
    prisma.position.count({ where }),
    prisma.position.findMany({
      where,
      orderBy,
      take: query.limit,
      skip: query.page * query.limit,
    }),
  ]);

  return paginate(docs, query, total);
};

export const createPositions = async (req: FastifyRequest) => {
  const body = CreateAutocompleteSchema.parse(req.body);

  const isDefined = await prisma.position.findUnique({ where: { name: body.name } });

  if (isDefined) {
    return;
  }

  await prisma.position.create({ data: body });
};

export const getSectors = async (req: FastifyRequest) => {
  const query = AutocompleteQuerySchema.parse(req.query);

  const where: Prisma.SectorWhereInput = {};
  let orderBy: Prisma.SectorOrderByWithRelationInput | undefined;

  if (query.filters) {
    const { id, name } = query.filters;

    if (name !== undefined) {
      where.name = like(name);
    }

    if (id !== undefined) {
      where.id = id;
    }
  }

  if (query.sorting) {
    const { id, desc } = query.sorting;
    orderBy = {
      [id]: desc ? 'desc' : 'asc',
    };
  }

  const [total, docs] = await Promise.all([
    prisma.sector.count({ where }),
    prisma.sector.findMany({
      where,
      orderBy,
      take: query.limit,
      skip: query.page * query.limit,
    }),
  ]);

  return paginate(docs, query, total);
};

export const createSector = async (req: FastifyRequest) => {
  const body = CreateAutocompleteSchema.parse(req.body);

  const isDefined = await prisma.sector.findUnique({ where: { name: body.name } });

  if (isDefined) {
    return;
  }

  await prisma.sector.create({ data: body });
};
