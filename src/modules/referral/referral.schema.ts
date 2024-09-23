import { z } from 'zod';
import { CandidateStatus } from '@prisma/client';

import { zodId, zodBaseString } from '@/utils/zod';

export const CreateReferralSchema = z.object({
  status: z.nativeEnum(CandidateStatus),
  candidateId: zodId,
  requestId: zodId,
  description: zodBaseString.nullish(),
});
