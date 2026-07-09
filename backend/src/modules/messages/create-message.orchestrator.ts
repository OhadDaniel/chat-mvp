import { z } from 'zod'
import { makeError } from '../../errors'
import { assertParticipant } from '../../lib/authz'
import { validate } from '../../lib/validate'
import { getById as getConversationById, setLastMessage } from '../conversations/conversations.service'
import { findById as findUserById } from '../auth/auth.service'
import { create } from './messages.service'
import type { CreateMessageResponse } from './messages.types'

const createMessageSchema = z.object({
  content: z.string().min(1, 'content is required').max(2000, 'content is too long'),
})

export function createMessageOrchestrator(
  conversationId: string,
  senderId: string,
  body: unknown
): CreateMessageResponse {
  const { content } = validate(createMessageSchema, body)

  const conversation = getConversationById(conversationId)
  if (!conversation) {
    throw makeError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found')
  }

  assertParticipant(conversation, senderId)

  const sender = findUserById(senderId)
  if (!sender) {
    throw makeError(404, 'USER_NOT_FOUND', 'Sender not found')
  }

  const message = create(conversationId, sender, content)

  setLastMessage(conversationId, {
    content: message.content,
    sentAt: message.sentAt,
    senderId: sender.id,
  })

  return { message }
}
