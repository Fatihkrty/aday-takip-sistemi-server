import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';
import { authMiddleware } from '@/middleware/auth.middleware';

import server from '@/services/fastify';

import { getNotifications, markAsReadNotification } from './notification.service';

const notificationRoutes: RouteOptions[] = [
  {
    method: 'GET',
    handler: getNotifications,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.notification.root,
  },
  {
    method: 'GET',
    handler: markAsReadNotification,
    preHandler: authMiddleware,
    url: API_ENDPOINTS.notification.markAsReadWithId,
  },
];

notificationRoutes.forEach((route) => server.route(route));
