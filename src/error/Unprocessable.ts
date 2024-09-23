import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import HttpError from './HttpError';

export class UnprocessableError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, message || ReasonPhrases.UNPROCESSABLE_ENTITY);
  }
}
