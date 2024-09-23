import type { RouteOptions } from 'fastify/types/route';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import {
  getSectors,
  searchUser,
  createSector,
  getLocations,
  getPositions,
  searchSector,
  searchCompany,
  createLocation,
  searchLocation,
  searchPosition,
  createPositions,
} from './autocomplete.service';

const autocompleteRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: searchUser,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.search.user,
  },
  {
    method: 'GET',
    handler: searchCompany,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.search.company,
  },
  {
    method: 'GET',
    handler: searchLocation,
    url: API_ENDPOINTS.autocomplete.search.location,
  },
  {
    method: 'GET',
    handler: searchPosition,
    url: API_ENDPOINTS.autocomplete.search.position,
  },
  {
    method: 'GET',
    handler: searchSector,
    url: API_ENDPOINTS.autocomplete.search.sector,
  },
  {
    method: 'GET',
    handler: getLocations,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.location,
  },
  {
    method: 'POST',
    handler: createLocation,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.location,
  },
  {
    method: 'GET',
    handler: getPositions,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.position,
  },
  {
    method: 'POST',
    handler: createPositions,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.position,
  },
  {
    method: 'GET',
    handler: getSectors,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.sector,
  },
  {
    method: 'POST',
    handler: createSector,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.autocomplete.sector,
  },
];

autocompleteRoutes.forEach((route) => server.route(route));
