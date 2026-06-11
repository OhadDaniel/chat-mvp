import { HttpException } from '@nestjs/common';

/**
 * Domain exception carrying the Week 3 error contract:
 * a machine-readable `code` plus optional `details`.
 * The AppExceptionFilter turns it into the
 * `{ error: { code, message, details? } }` envelope.
 */
export class AppException extends HttpException {
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message, status);
    this.code = code;
    this.details = details;
  }
}
