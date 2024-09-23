import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import HttpError from './HttpError';

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.NOT_FOUND, message || ReasonPhrases.NOT_FOUND);
  }
}
