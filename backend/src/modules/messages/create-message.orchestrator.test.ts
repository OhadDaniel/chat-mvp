import { describe, it, expect } from 'vitest'
import { createMessageOrchestrator } from './create-message.orchestrator'

describe('createMessageOrchestrator', () => {
  it('throws 403 when sender is not a participant', () => {
    try {
      createMessageOrchestrator('conv-1', 'user-3', { content: 'hello' })
      expect.fail('should have thrown')
    } catch (err: unknown) {
      const e = err as { status: number; code: string }
      expect(e.status).toBe(403)
      expect(e.code).toBe('NOT_A_PARTICIPANT')
    }
  })

  it('throws 400 when content is missing', () => {
    try {
      createMessageOrchestrator('conv-1', 'user-1', {})
      expect.fail('should have thrown')
    } catch (err: unknown) {
      const e = err as { status: number; code: string }
      expect(e.status).toBe(400)
      expect(e.code).toBe('VALIDATION_ERROR')
    }
  })
})
