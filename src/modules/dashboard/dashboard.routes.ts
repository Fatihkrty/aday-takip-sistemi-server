import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import { getCompanyStatus, getDashboardInfo } from './dashboard.service';

const dashboardRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getDashboardInfo,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.dashboard.root,
  },
  {
    method: 'GET',
    handler: getCompanyStatus,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.dashboard.companyStatus,
  },
];

dashboardRoutes.forEach((route) => server.route(route));
