import type { RouteOptions } from 'fastify';

import API_ENDPOINTS from '@/constants/api-endpoints';

import server from '@/services/fastify';

import { getMe, login, logout, checkCode, resetPassword, forgotPassword } from './auth.service';

const routes: RouteOptions[] = [
  {
    method: 'POST',
    handler: login,
    url: API_ENDPOINTS.auth.login,
  },
  {
    method: 'GET',
    handler: logout,
    url: API_ENDPOINTS.auth.logout,
  },
  {
    method: 'GET',
    handler: getMe,
    url: API_ENDPOINTS.auth.me,
  },
  {
    method: 'GET',
    handler: checkCode,
    url: API_ENDPOINTS.auth.checkCode,
  },
  {
    method: 'POST',
    handler: forgotPassword,
    url: API_ENDPOINTS.auth.forgotPassword,
  },
  {
    method: 'POST',
    handler: resetPassword,
    url: API_ENDPOINTS.auth.resetPassword,
  },
];

routes.forEach((route) => server.route(route));
