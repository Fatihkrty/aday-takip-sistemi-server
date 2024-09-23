import { z } from 'zod';
import { Gender, Compatibility, MilitaryService } from '@prisma/client';

import { BaseQuerySchema } from '@/utils/validation/base-query.schema';
import {
  zodId,
  zodName,
  zodEmail,
  zodPhone,
  zodDateRange,
  zodBaseString,
  zodNumberRange,
  zodAutocomplete,
} from '@/utils/zod';

export const CandidateSearchQuery = z.object({
  name: zodBaseString.optional(),
});

export const CandidateQuerySchema = BaseQuerySchema.extend({
  filters: z
    .object({
      id: zodId.nullish(),
      name: z.string().nullish(),
      email: z.string().nullish(),
      phone: z.string().nullish(),
      location: z.string().nullish(),
      salary: zodNumberRange.nullish(),
      rate: zodNumberRange.nullish(),
      positionName: z.string().nullish(),
      languageName: z.string().nullish(),
      referenceName: z.string().nullish(),
      gender: z.nativeEnum(Gender).nullish(),
      militaryService: z.nativeEnum(MilitaryService).array().nullish(),
      compatibility: z.nativeEnum(Compatibility).array().nullish(),
      createdAt: zodDateRange.nullish(),
    })
    .nullish(),
});

export const CreateCandidateSchema = z.object({
  name: zodName,
  email: zodEmail.nullish(),
  phone: zodPhone.nullish(),
  note: zodBaseString.nullish(),
  positions: zodAutocomplete.array(),
  location: zodAutocomplete.nullish(),
  rate: z.coerce
    .number()
    .min(1, 'Bu alan en az 1 olabilir')
    .max(5, 'Bu alan en fazla 5 olabilir')
    .nullish(),
  gender: z.nativeEnum(Gender, { invalid_type_error: 'Geçerli değer girin' }),
  salary: z.coerce.number().nullish(),
  compatibility: z.nativeEnum(Compatibility).nullish(),
  militaryService: z.nativeEnum(MilitaryService, { invalid_type_error: 'Geçerli değer girin' }),
  languages: z
    .object({
      name: zodAutocomplete,
      rate: z.coerce.number().min(1, 'Bu alan en az 1 olabilir'),
    })
    .array(),
  references: z
    .object({
      name: zodName,
      phone: zodPhone.nullish(),
    })
    .array(),
});
