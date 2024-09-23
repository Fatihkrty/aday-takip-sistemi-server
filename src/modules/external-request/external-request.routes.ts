import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import {
  getExternalRequests,
  checkExternalRequest,
  createExternalRequest,
} from './external-request.service';

const externalRequestRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getExternalRequests,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.externalRequest.root,
  },
  {
    method: 'GET',
    handler: checkExternalRequest,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.externalRequest.withCode,
  },
  {
    method: 'POST',
    handler: createExternalRequest,
    url: API_ENDPOINTS.externalRequest.withCode,
  },
];

externalRequestRoutes.forEach((route) => server.route(route));
