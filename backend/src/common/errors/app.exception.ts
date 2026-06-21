import { HttpException } from '@nestjs/common';


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
