import { describe, it, expect } from 'vitest'
import { assertParticipant } from './authz'
import type { Conversation } from '../types'

const makeConversation = (participantIds: string[]): Conversation => ({
  id: 'conv-1',
  participants: participantIds.map(id => ({ id, name: id, avatarInitials: 'XX' })),
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
})

describe('assertParticipant', () => {
  it('does not throw when user is a participant', () => {
    const conv = makeConversation(['user-1', 'user-2'])
    expect(() => assertParticipant(conv, 'user-1')).not.toThrow()
  })

  it('throws 403 NOT_A_PARTICIPANT when user is not in the conversation', () => {
    const conv = makeConversation(['user-1', 'user-2'])
    try {
      assertParticipant(conv, 'user-99')
      expect.fail('should have thrown')
    } catch (err: unknown) {
      const e = err as { status: number; code: string }
      expect(e.status).toBe(403)
      expect(e.code).toBe('NOT_A_PARTICIPANT')
    }
  })
})
