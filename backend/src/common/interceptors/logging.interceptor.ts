import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          this.logger.log(
            `${method} ${originalUrl} ${response.statusCode} — ${Date.now() - startedAt}ms`,
          );
        },
        error: (error: Error) => {
          this.logger.warn(
            `${method} ${originalUrl} failed — ${Date.now() - startedAt}ms (${error.message})`,
          );
        },
      }),
    );
  }
}
