import { z } from 'zod'
import { makeError } from '../../errors'
import { validate } from '../../lib/validate'
import { findUserByName } from './auth.repository'
import type { LoginResponse } from './auth.types'

const loginSchema = z.object({
  name: z.string().min(1, 'name is required'),
  password: z.string().min(1, 'password is required'),
})

export function loginOrchestrator(body: unknown): LoginResponse {
  const { name } = validate(loginSchema, body)

  const user = findUserByName(name)

  if (!user) {
    throw makeError(404, 'USER_NOT_FOUND', 'User not found')
  }

  return {
    token: user.id,
    user,
  }
}
