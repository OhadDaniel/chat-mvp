import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppExceptionFilter } from './common/filters/app-exception.filter'
import { validationExceptionFactory } from './common/pipes/validation-exception.factory'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ origin: 'http://localhost:5173' })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  )

  app.useGlobalFilters(new AppExceptionFilter())

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT') ?? 3001

  await app.listen(port)
}

void bootstrap()
