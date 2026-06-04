import { makeError } from '../../errors'
import { assertParticipant } from '../../lib/authz'
import { getById as getConversationById } from '../conversations/conversations.service'
import { getPage } from './messages.service'
import type { GetMessagesResponse } from './messages.types'

export function getMessagesOrchestrator(
  conversationId: string,
  userId: string,
  cursor?: string,
  limit?: number
): GetMessagesResponse {
  const conversation = getConversationById(conversationId)

  if (!conversation) {
    throw makeError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found')
  }

  assertParticipant(conversation, userId)

  return getPage(conversationId, cursor, limit)
}
