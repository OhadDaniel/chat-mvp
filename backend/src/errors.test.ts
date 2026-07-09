import { describe, it, expect } from 'vitest'
import { makeError, isAppError } from './errors'

describe('isAppError', () => {
  it('returns true for errors created by makeError', () => {
    expect(isAppError(makeError(400, 'VALIDATION_ERROR', 'bad input'))).toBe(true)
  })

  it('returns false for plain Error instances', () => {
    expect(isAppError(new Error('boom'))).toBe(false)
  })
})
