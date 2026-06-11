import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Response } from 'express'
import { AppException } from '../errors/app.exception'

type ErrorEnvelope = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * Global filter — the Nest equivalent of the Week 3 `errorHandler`
 * middleware. Every exception leaves the API in the same envelope:
 * `{ error: { code, message, details? } }`.
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    const { status, body } = this.toEnvelope(exception)

    if (status >= 500) {
      this.logger.error(
        `${body.error.code}: ${body.error.message}`,
        exception instanceof Error ? exception.stack : String(exception),
      )
    } else {
      this.logger.warn(`${body.error.code}: ${body.error.message}`)
    }

    response.status(status).json(body)
  }

  private toEnvelope(exception: unknown): {
    status: number
    body: ErrorEnvelope
  } {
    if (exception instanceof AppException) {
      return {
        status: exception.getStatus(),
        body: {
          error: {
            code: exception.code,
            message: exception.message,
            ...(exception.details !== undefined && {
              details: exception.details,
            }),
          },
        },
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      return {
        status,
        body: { error: { code: codeFromStatus(status), message: exception.message } },
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        },
      },
    }
  }
}

function codeFromStatus(status: number): string {
  const name: string | undefined = HttpStatus[status]
  return name ?? 'ERROR'
}
