
export type AppError = {
  status: number
  code: string
  message: string
  details?: unknown
}


export function isAppError(err: unknown): err is AppError {
  return typeof err === 'object' && err !== null && 'status' in err
}

export function makeError(
  status: number,
  code: string,
  message: string,
  details?: unknown
): AppError {
  return { status, code, message, details }
}
