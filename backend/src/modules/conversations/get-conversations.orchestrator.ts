import { findAllByUserId } from './conversations.repository'
import type { GetConversationsResponse } from './conversations.types'

export function getConversations(userId: string, search?: string): GetConversationsResponse {
  let conversations = findAllByUserId(userId)

  if (search) {
    const term = search.toLowerCase()
    conversations = conversations.filter(c =>
      c.participants.some(p => p.name.toLowerCase().includes(term))
    )
  }

  conversations = conversations.sort((a, b) => {
    if (!a.lastMessageAt) return 1
    if (!b.lastMessageAt) return -1
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  })

  return { conversations }
}
