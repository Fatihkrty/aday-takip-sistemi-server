import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import {
  getCompanies,
  createCompany,
  deleteCompany,
  updateCompany,
  sendRequestForm,
  createCompanyContract,
  deleteCompanyContract,
} from './company.service';

const companyRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getCompanies,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.root,
  },
  {
    method: 'POST',
    handler: createCompany,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.root,
  },
  {
    method: 'PUT',
    handler: updateCompany,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.withId,
  },
  {
    method: 'DELETE',
    handler: deleteCompany,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.withId,
  },
  {
    method: 'POST',
    handler: createCompanyContract,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.contractWithId,
  },
  {
    method: 'DELETE',
    handler: deleteCompanyContract,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.contractWithId,
  },
  {
    method: 'POST',
    handler: sendRequestForm,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.company.sendReqForm,
  },
];

companyRoutes.forEach((route) => server.route(route));
