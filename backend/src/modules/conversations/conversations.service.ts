import {
  findAllByUserId,
  findById,
  findByParticipants,
  createConversation,
  updatePinned,
  updateLastMessage,
} from './conversations.repository'
import type { Conversation, User } from '../../types'

export function getAll(userId: string, search?: string): Conversation[] {
  let conversations = findAllByUserId(userId)

  if (search) {
    const term = search.toLowerCase()
    conversations = conversations.filter(c =>
      c.participants.some(p => p.name.toLowerCase().includes(term))
    )
  }

  return conversations.sort((a, b) => {
    if (!a.lastMessageAt) return 1
    if (!b.lastMessageAt) return -1
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  })
}

export function getById(id: string): Conversation | undefined {
  return findById(id)
}

export function existsBetween(userIdA: string, userIdB: string): boolean {
  return !!findByParticipants(userIdA, userIdB)
}

export function create(participants: User[]): Conversation {
  return createConversation(participants)
}

export function patch(id: string, pinned: boolean): Conversation | undefined {
  return updatePinned(id, pinned)
}

export function setLastMessage(
  id: string,
  lastMessage: { content: string; sentAt: string; senderId: string }
): void {
  updateLastMessage(id, lastMessage)
}
