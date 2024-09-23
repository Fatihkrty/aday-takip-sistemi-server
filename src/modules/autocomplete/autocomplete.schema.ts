import { z } from 'zod';

import { BaseQuerySchema } from '@/utils/validation/base-query.schema';
import { zodId, zodBoolean, zodBaseString, zodAutocomplete } from '@/utils/zod';

export const CreateAutocompleteSchema = z.object({
  name: zodAutocomplete,
});

export const AutocompleteSearchQuerySchema = z.object({ name: z.coerce.string() });

export const AutocompleteQuerySchema = BaseQuerySchema.extend({
  filters: z
    .object({
      id: zodId.optional(),
      name: zodBaseString.optional(),
    })
    .optional(),
  sorting: z
    .object({
      id: z.enum(['id', 'name']),
      desc: zodBoolean,
    })
    .optional(),
});
