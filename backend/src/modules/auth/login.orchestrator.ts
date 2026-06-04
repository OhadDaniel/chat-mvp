import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { makeError } from '../../errors'
import { validate } from '../../lib/validate'
import { findByName } from './auth.service'
import type { LoginResponse } from './auth.types'

const loginSchema = z.object({
  name: z.string().min(1, 'name is required'),
  password: z.string().min(1, 'password is required'),
})

export function loginOrchestrator(body: unknown): LoginResponse {
  const { name } = validate(loginSchema, body)

  const user = findByName(name)

  if (!user) {
    throw makeError(404, 'USER_NOT_FOUND', 'User not found')
  }

  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.ACCESS_TOKEN_SECRET!,
  )

  return { token, user }
}
