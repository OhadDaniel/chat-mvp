import type { Request, Response, NextFunction } from 'express'
import { makeError, type AppError } from '../errors'

const FALLBACK_CODE = 'INTERNAL_SERVER_ERROR'
const FALLBACK_MESSAGE = 'Something went wrong'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError =
    typeof err === 'object' && err !== null && 'status' in err

  if (!isAppError) {
    console.error('[RAW ERROR]', err)
  }

  const appErr: AppError = isAppError
    ? (err as AppError)
    : makeError(500, FALLBACK_CODE, FALLBACK_MESSAGE)

  console.error(`[ERROR] ${appErr.code}: ${appErr.message}`, appErr.details ?? '')

  res.status(appErr.status).json({
    error: {
      code: appErr.code,
      message: appErr.message,
      ...(appErr.details !== undefined && { details: appErr.details }),
    },
  })
}
