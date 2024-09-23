import { z } from 'zod';

import { BaseQuerySchema } from '@/utils/validation/base-query.schema';
import { zodName, zodEmail, zodBoolean, zodBaseString } from '@/utils/zod';

export const CreateCompanySchema = z.object({
  name: zodName,
  sector: z.string(),
  email: zodEmail.nullish(),
  description: zodBaseString.nullish(),
  location: z.string().nullish(),
  address: z.string().nullish(),
});

export const CreateCompanyContractSchema = z.object({
  startDate: z.coerce.date().default(new Date()),
  endDate: z.coerce.date().default(new Date()),
});

export const CompanyQuerySchema = BaseQuerySchema.extend({
  filters: z
    .object({
      id: z.coerce.number().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      sector: z.string().optional(),
      description: z.string().optional(),
      location: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  sorting: z
    .object({
      id: z.enum(['id', 'name', 'email', 'sector', 'address', 'location', 'createdAt']),
      desc: zodBoolean,
    })
    .optional(),
});
