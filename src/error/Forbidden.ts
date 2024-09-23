import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import HttpError from './HttpError';

export class ForbiddenError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.FORBIDDEN, message || ReasonPhrases.FORBIDDEN);
  }
}
