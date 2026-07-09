import { z } from 'zod'
import { makeError } from '../errors'

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const details = result.error.issues.map(e => `${String(e.path.join('.'))}: ${e.message}`)
    throw makeError(400, 'VALIDATION_ERROR', 'Invalid request body', details)
  }

  return result.data
}
