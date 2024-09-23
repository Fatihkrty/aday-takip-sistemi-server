import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { roleMiddleware } from '@/middleware/role.middleware';

import server from '@/services/fastify';

import { getUsers, createUser, deleteUser, updateUser } from './user.service';

const userRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getUsers,
    preHandler: roleMiddleware('admin'),
    url: API_ENDPOINTS.user.root,
  },
  {
    method: 'POST',
    handler: createUser,
    preHandler: roleMiddleware('admin'),
    url: API_ENDPOINTS.user.root,
  },
  {
    method: 'PUT',
    handler: updateUser,
    preHandler: roleMiddleware('admin'),
    url: API_ENDPOINTS.user.withId,
  },
  {
    method: 'DELETE',
    handler: deleteUser,
    preHandler: roleMiddleware('admin'),
    url: API_ENDPOINTS.user.withId,
  },
];

userRoutes.forEach((route) => server.route(route));
