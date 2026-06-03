
export type AppError = {
  status: number
  code: string
  message: string
  details?: unknown
}


export function makeError(
  status: number,
  code: string,
  message: string,
  details?: unknown
): AppError {
  return { status, code, message, details }
}
