import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import HttpError from './HttpError';

export class BadRequestError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.BAD_REQUEST, message || ReasonPhrases.BAD_REQUEST);
  }
}
