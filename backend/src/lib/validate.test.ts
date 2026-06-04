import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validate } from './validate'

const schema = z.object({
  content: z.string().min(1, 'content is required'),
})

describe('validate', () => {
  it('returns parsed data when input is valid', () => {
    const result = validate(schema, { content: 'hello' })
    expect(result).toEqual({ content: 'hello' })
  })

  it('throws 400 VALIDATION_ERROR when a required field is missing', () => {
    try {
      validate(schema, {})
      expect.fail('should have thrown')
    } catch (err: unknown) {
      const e = err as { status: number; code: string }
      expect(e.status).toBe(400)
      expect(e.code).toBe('VALIDATION_ERROR')
    }
  })

  it('includes field-level details in the error', () => {
    try {
      validate(schema, { content: '' })
      expect.fail('should have thrown')
    } catch (err: unknown) {
      const e = err as { status: number; details: string[] }
      expect(Array.isArray(e.details)).toBe(true)
      expect(e.details[0]).toContain('content')
    }
  })
})
