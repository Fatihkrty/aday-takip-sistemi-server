import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import HttpError from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.UNAUTHORIZED, message || ReasonPhrases.UNAUTHORIZED);
  }
}
