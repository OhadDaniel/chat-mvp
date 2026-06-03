import { makeError } from '../errors'
import type { Conversation } from '../types'

export function assertParticipant(conversation: Conversation, userId: string): void {
  if (!conversation.participants.some(p => p.id === userId)) {
    throw makeError(403, 'NOT_A_PARTICIPANT', 'You are not a participant of this conversation')
  }
}
