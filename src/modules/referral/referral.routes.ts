import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import { getReferrals, createReferral, deleteReferral } from './referral.service';

const referralRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getReferrals,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.referral.root,
  },
  {
    method: 'POST',
    handler: createReferral,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.referral.root,
  },
  {
    method: 'DELETE',
    handler: deleteReferral,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.referral.withId,
  },
];

referralRoutes.forEach((route) => server.route(route));
