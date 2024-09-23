export default class HttpError extends Error {
  constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }

  statusCode: number;
}
