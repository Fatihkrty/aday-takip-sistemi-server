import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import {
  getCandidate,
  getCandidates,
  createCandidate,
  searchCandidate,
  updateCandidate,
  createCandidateCv,
  deleteCandidateCv,
} from './candidate.service';

const canidateRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getCandidates,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.root,
  },
  {
    method: 'GET',
    handler: searchCandidate,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.search,
  },
  {
    method: 'GET',
    handler: getCandidate,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.withId,
  },
  {
    method: 'POST',
    handler: createCandidate,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.root,
  },
  {
    method: 'DELETE',
    handler: deleteCandidateCv,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.cvWithId,
  },
  {
    method: 'POST',
    handler: createCandidateCv,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.cvWithId,
  },
  {
    method: 'PUT',
    handler: updateCandidate,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.candidate.withId,
  },
];

canidateRoutes.forEach((route) => server.route(route));
