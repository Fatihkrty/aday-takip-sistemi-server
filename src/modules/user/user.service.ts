import type { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';
import { destroyUserSession } from '@/services/redis';

import { NotFoundError } from '@/error/NotFound';

import { zodId } from '@/utils/zod';
import paginate from '@/utils/paginate';
import { hashPassword } from '@/utils/bcrypt';
import generateCode from '@/utils/generateCode';

import { UserQuerySchema, CreateUserSchema } from './user.schema';

export const getUsers = async (req: FastifyRequest) => {
  const query = UserQuerySchema.parse(req.query);

  const where: Prisma.UserWhereInput = {};
  let orderBy: Prisma.UserOrderByWithAggregationInput = { createdAt: 'desc' };

  if (query.filters) {
    const { email, isActive, name, phone, role, id } = query.filters;

    if (id !== undefined) {
      where.id = id;
    }

    if (role !== undefined) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (phone !== undefined) {
      where.phone = {
        contains: phone,
        mode: 'insensitive',
      };
    }

    if (name !== undefined) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (email !== undefined) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }
  }

  if (query.sorting) {
    const { id, desc } = query.sorting;
    orderBy = {
      [id]: desc ? 'desc' : 'asc',
    };
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip: query.page * query.limit,
      take: query.limit,
    }),
  ]);

  return paginate(users, query, total);
};

export const createUser = async (req: FastifyRequest) => {
  const parsedBody = CreateUserSchema.parse(req.body);

  // TODO: Will send password with email service
  const password = await hashPassword(generateCode(8));

  await prisma.user.create({
    data: {
      ...parsedBody,
      secret: { create: { password } },
    },
  });
};

export const updateUser = async (req: FastifyRequest) => {
  const userId = zodId.parse((req.params as any).id);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError('Kullanıcı bulunamadı');
  }

  const parsedBody = await CreateUserSchema.partial().parseAsync(req.body);

  if (parsedBody.isActive === false || parsedBody.role !== undefined) {
    await destroyUserSession(user.id);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: parsedBody,
  });
};

export const deleteUser = async (req: FastifyRequest) => {
  const userId = zodId.parse((req.params as any).id);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError('Kullanıcı bulunamadı');
  }

  await destroyUserSession(user.id);

  await prisma.user.delete({ where: { id: user.id } });
};
