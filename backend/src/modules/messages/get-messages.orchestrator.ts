import { makeError } from '../../errors'
import { assertParticipant } from '../../lib/authz'
import { paginate } from '../../lib/paginate'
import { findById as findConversationById } from '../conversations/conversations.repository'
import { findByConversationId } from './messages.repository'
import type { GetMessagesResponse } from './messages.types'

export function getMessagesOrchestrator(
  conversationId: string,
  userId: string,
  cursor?: string,
  limit?: number
): GetMessagesResponse {
  const conversation = findConversationById(conversationId)

  if (!conversation) {
    throw makeError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found')
  }

  assertParticipant(conversation, userId)

  const all = findByConversationId(conversationId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())

  const { items: messages, nextCursor } = paginate(all, cursor, limit)

  return { messages, nextCursor }
}
