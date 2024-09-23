import { z } from 'zod';

export const BaseQuerySchema = z.object({
  page: z.coerce.number().nonnegative().default(0),
  limit: z.coerce.number().nonnegative().default(20),
});

export type IBaseQuerySchema = z.infer<typeof BaseQuerySchema>;
