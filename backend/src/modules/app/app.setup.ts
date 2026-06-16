import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppExceptionFilter } from '../../common/filters/app-exception.filter';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { validationExceptionFactory } from '../../common/pipes/validation-exception.factory';

/**
 * The full request pipeline (CORS, validation, error envelope,
 * logging) in one function — used by main.ts AND by integration
 * tests, so tests exercise exactly what production runs.
 */
export function configureApp(app: INestApplication): void {
  app.enableCors({ origin: 'http://localhost:5173' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
}
