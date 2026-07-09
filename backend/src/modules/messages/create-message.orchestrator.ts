import { z } from 'zod'
import { makeError } from '../../errors'
import { assertParticipant } from '../../lib/authz'
import { validate } from '../../lib/validate'
import { findById as findConversationById, updateLastMessage } from '../conversations/conversations.repository'
import { findUserById } from '../auth/auth.repository'
import { createMessage } from './messages.repository'
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
  const conversation = findConversationById(conversationId)

  if (!conversation) {
    throw makeError(404, 'CONVERSATION_NOT_FOUND', 'Conversation not found')
  }

  assertParticipant(conversation, senderId)

  const sender = findUserById(senderId)

  if (!sender) {
    throw makeError(404, 'USER_NOT_FOUND', 'Sender not found')
  }

  const message = createMessage(conversationId, sender, content)


  updateLastMessage(conversationId, {
    content: message.content,
    sentAt: message.sentAt,
    senderId: sender.id,
  })

  return { message }
}
