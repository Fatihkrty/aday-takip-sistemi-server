import { z } from 'zod';
import {
  Gender,
  WorkDay,
  WorkType,
  SideRights,
  RequestStatus,
  CompanyWorkType,
  MilitaryService,
} from '@prisma/client';

import { BaseQuerySchema } from '@/utils/validation/base-query.schema';
import {
  zodId,
  zodName,
  zodEmail,
  zodPhone,
  zodBoolean,
  zodBaseString,
  zodAutocomplete,
} from '@/utils/zod';

export const ReuestQueryScheme = BaseQuerySchema.extend({
  filters: z
    .object({
      id: zodId.optional(),
      companyName: z.string().optional(),
      department: z.string().optional(),
      workerReqCount: z.coerce.number({ invalid_type_error: 'Geçerli değer girin' }).optional(),
      jobDescription: z.string().optional(),
      description: z.string().optional(),
      requiredQualifications: z.string().optional(),
      salary: z.coerce.number({ invalid_type_error: 'Geçerli değer girin' }).optional(),
      prim: zodBoolean.optional(),
      workType: z.nativeEnum(WorkType).array().optional(),
      companyWorkType: z.nativeEnum(CompanyWorkType).optional(),
      workDays: z.nativeEnum(WorkDay).array().optional(),
      workHourStart: z.string().optional(),
      workHourEnd: z.string().optional(),
      advisorName: z.string().optional(),
      advisorPhone: z.string().optional(),
      advisorEmail: z.string().optional(),
      advisorTitle: z.string().optional(),
      sideRights: z.nativeEnum(SideRights).array().optional(),
      gender: z
        .nativeEnum(Gender)
        .or(z.enum(['null']))
        .optional(),
      militaryService: z
        .nativeEnum(MilitaryService)
        .or(z.enum(['null']))
        .optional(),
      status: z.nativeEnum(RequestStatus).optional(),
      isExternal: zodBoolean.optional(),
      positionName: z.string().optional(),
      candidateId: zodId.array().optional(),
      userName: z.string().optional(),
      userId: zodId.optional(),
    })
    .optional(),
  sorting: z
    .object({
      id: z.enum([
        'id',
        'department',
        'workerReqCount',
        'salary',
        'advisorName',
        'advisorTitle',
        'closedAt',
      ]),
      desc: zodBoolean,
    })
    .optional(),
});

export const RequestScheme = z.object({
  department: zodBaseString.trim().nullish(),
  workerReqCount: z.coerce
    .number({ invalid_type_error: 'Geçerli değer girin' })
    .min(0, 'Bu alan en az 1 olabilir'),
  jobDescription: zodBaseString.nullish(),
  description: zodBaseString.nullish(),
  requiredQualifications: zodBaseString.nullish(),
  salary: z.coerce
    .number({ invalid_type_error: 'Geçerli değer girin' })
    .nonnegative('Bu alan negatif değer olamaz'),
  prim: z.coerce.boolean(),
  workType: z.nativeEnum(WorkType).array(),
  companyWorkType: z.nativeEnum(CompanyWorkType).nullish(),
  workDays: z.nativeEnum(WorkDay).array(),
  workHourStart: zodBaseString.trim().nullish(),
  workHourEnd: zodBaseString.trim().nullish(),
  advisorName: zodName.nullish(),
  advisorPhone: zodPhone.nullish(),
  advisorEmail: zodEmail.nullish(),
  advisorTitle: zodAutocomplete.nullish(),
  sideRights: z.nativeEnum(SideRights).array(),
  gender: z.nativeEnum(Gender).nullish(),
  isExternal: z.coerce.boolean().optional(),
  militaryService: z.nativeEnum(MilitaryService).nullish(),
  languages: z
    .object({
      name: zodAutocomplete,
      rate: z.coerce
        .number({ invalid_type_error: 'Geçerli değer girin' })
        .min(1, 'Bu alan en az 1 olabilir')
        .max(5, 'Bu alan en fazla 5 olabilir'),
    })
    .array(),
  position: zodAutocomplete.optional(),
  userId: zodId.nullish(),
  companyId: zodId,
});

export const ChangeRequestStatusScheme = z.object({
  status: z.nativeEnum(RequestStatus),
});
