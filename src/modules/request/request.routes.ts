import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import {
  getRequest,
  getRequests,
  allowRequest,
  createRequest,
  updateRequest,
  changeStatusRequest,
} from './request.service';

const requestRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getRequests,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.request.root,
  },
  {
    method: 'GET',
    handler: getRequest,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.request.withId,
  },
  {
    method: 'POST',
    handler: createRequest,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.request.root,
  },
  {
    method: 'PUT',
    handler: updateRequest,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.request.withId,
  },
  {
    method: 'GET',
    handler: allowRequest,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.request.allowWithId,
  },
  {
    method: 'PUT',
    handler: changeStatusRequest,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.request.changeStatusWithId,
  },
];

requestRoutes.forEach((route) => server.route(route));
