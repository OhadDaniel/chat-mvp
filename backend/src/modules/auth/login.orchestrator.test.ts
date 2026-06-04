import { describe, it, expect, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { loginOrchestrator } from './login.orchestrator'

const SECRET = 'test-secret'

beforeEach(() => {
  process.env.ACCESS_TOKEN_SECRET = SECRET
})

describe('loginOrchestrator', () => {
  it('returns a signed JWT, not the raw user id', () => {
    const result = loginOrchestrator({ name: 'Ohad Daniel', password: 'any' })
    expect(result.token).not.toBe(result.user.id)
    const payload = jwt.verify(result.token, SECRET) as { id: string }
    expect(payload.id).toBe(result.user.id)
  })
})
