import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import { getFileMinio } from './upload.service';

export const uploadRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getFileMinio,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.upload.getFile,
  },
];

uploadRoutes.forEach((route) => server.route(route));
