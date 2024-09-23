import type { FastifyRequest } from 'fastify';

import dayjs from 'dayjs';

import prisma from '@/services/prisma';

import { NotFoundError } from '@/error/NotFound';
import { ForbiddenError } from '@/error/Forbidden';
import { BadRequestError } from '@/error/BadRequest';
import { UnauthorizedError } from '@/error/Unauthorization';

import omitObject from '@/utils/omit-object';
import { hashPassword, comparePassword } from '@/utils/bcrypt';

import { LoginSchema, ResetPasswordSchema, ForgotPasswordSchema } from './auth.schema';

export const login = async (req: FastifyRequest) => {
  const parsedData = LoginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: parsedData.email },
    include: { secret: true },
  });

  if (
    !user ||
    !(await comparePassword(parsedData.password, user.secret.password)) ||
    !user.isActive
  ) {
    throw new UnauthorizedError('Kullanıcı adı veya şifre hatalı');
  }

  req.session.set('userId', user.id);
  req.session.set('role', user.role);
  await req.session.save();

  prisma.user
    .update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })
    .then();

  return omitObject(user, 'deletedAt', 'secret', 'secretId');
};

export const logout = async (req: FastifyRequest) => {
  await req.destroySession();
};

export const getMe = async (req: FastifyRequest) => {
  const userId = req.session.get('userId') as number;

  if (!userId) {
    throw new UnauthorizedError('Önce giriş yapın');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedError('Önce giriş yapın');
  }

  return omitObject(user, 'deletedAt', 'secretId');
};

export const forgotPassword = async (req: FastifyRequest) => {
  const validate = ForgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: validate.email },
    include: { secret: true },
  });

  if (!user) {
    return;
  }

  if (user.secret.retryCount >= 5) {
    throw new ForbiddenError('E-posta çok sık aralıklarla gönderiliyor.');
  }

  const resetCode = crypto.randomUUID();

  await prisma.userSecret.update({
    where: { id: user.secret.id },
    data: { codeCreatedAt: new Date(), resetCode, retryCount: user.secret.retryCount + 1 },
  });
};

export const checkCode = async (req: FastifyRequest) => {
  const { code } = req.query as any;

  if (!code) {
    throw new BadRequestError('Kod geçersiz');
  }

  const checkCode = await prisma.userSecret.findUnique({
    where: {
      resetCode: code,
    },
  });

  if (!checkCode) {
    throw new NotFoundError('Sıfırlama kodu bulunamadı');
  }
};

export const resetPassword = async (req: FastifyRequest) => {
  const { code } = req.query as any;

  if (!code) {
    throw new BadRequestError('Şifre sıfırlama kodu geçersiz.');
  }

  const secret = await prisma.userSecret.findUnique({ where: { resetCode: code } });

  if (!secret) {
    throw new BadRequestError('Şifre sıfırlama kodu geçersiz.');
  }

  if (secret.codeCreatedAt) {
    const expireTime = dayjs().add(24, 'hour');
    const isExpired = dayjs().isAfter(expireTime);

    if (isExpired) {
      throw new ForbiddenError('Şifre sıfırlama süresi doldu. Yeniden email gönderin.');
    }
  }

  const validate = ResetPasswordSchema.parse(req.body);
  const password = await hashPassword(validate.password);

  await prisma.userSecret.update({
    where: { id: secret.id },
    data: { codeCreatedAt: null, retryCount: 0, resetCode: null, password },
  });
};
