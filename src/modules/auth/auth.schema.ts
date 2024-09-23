import * as z from 'zod';

import { zodEmail, zodPassword } from '@/utils/zod';

export const LoginSchema = z.object({
  email: zodEmail,
  password: zodPassword,
});

export const ForgotPasswordSchema = z.object({
  email: zodEmail,
});

export const ResetPasswordSchema = z
  .object({
    password: zodPassword,
    confirmPassword: zodPassword,
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
      });
    }
  });
