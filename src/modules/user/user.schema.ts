import { z } from 'zod';
import { UserRoles } from '@prisma/client';

import { BaseQuerySchema } from '@/utils/validation/base-query.schema';
import { zodId, zodName, zodEmail, zodPhone, zodBoolean } from '@/utils/zod';

export const CreateUserSchema = z.object({
  name: zodName,
  email: zodEmail,
  phone: zodPhone.nullish(),
  role: z.nativeEnum(UserRoles),
  isActive: z.boolean(),
});

export const UserQuerySchema = BaseQuerySchema.extend({
  filters: z
    .object({
      id: zodId.optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      role: z.nativeEnum(UserRoles).optional(),
      isActive: zodBoolean.optional(),
    })
    .optional(),

  sorting: z
    .object({
      id: z.enum(['id', 'email', 'isActive', 'createdAt', 'lastLogin', 'name', 'role']),
      desc: zodBoolean,
    })
    .optional(),
});
