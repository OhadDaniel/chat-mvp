import { getAll } from './conversations.service'
import type { GetConversationsResponse } from './conversations.types'

export function getConversations(userId: string, search?: string): GetConversationsResponse {
  const conversations = getAll(userId, search)
  return { conversations }
}
