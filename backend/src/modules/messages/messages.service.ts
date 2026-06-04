import { findByConversationId, createMessage } from './messages.repository'
import { paginate } from '../../lib/paginate'
import type { Message, User } from '../../types'

export function getPage(
  conversationId: string,
  cursor?: string,
  limit?: number
): { messages: Message[]; nextCursor: string | null } {
  const all = findByConversationId(conversationId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())

  const { items: messages, nextCursor } = paginate(all, cursor, limit)
  return { messages, nextCursor }
}

export function create(conversationId: string, sender: User, content: string): Message {
  return createMessage(conversationId, sender, content)
}
