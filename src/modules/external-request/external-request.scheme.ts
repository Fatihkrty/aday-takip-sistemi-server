import { z } from 'zod';

import { zodBaseString } from '@/utils/zod';
import { BaseQuerySchema } from '@/utils/validation/base-query.schema';

import { RequestScheme } from '../request/request.scheme';

export const ExternalRequestQueryScheme = BaseQuerySchema.extend({
  filters: z
    .object({
      name: zodBaseString.nullish(),
      sector: zodBaseString.nullish(),
      email: zodBaseString.nullish(),
      isActive: z.enum(['true', 'false']).nullish(),
    })
    .optional(),
});

export const ExternalRequestScheme = RequestScheme.omit({
  userId: true,
  companyId: true,
  companyWorkType: true,
});

export type IExternalRequestSchema = z.infer<typeof ExternalRequestScheme>;
