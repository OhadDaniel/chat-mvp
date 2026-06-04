import { store } from '../../store'
import { v4 as uuidv4 } from 'uuid'
import type { Conversation, User } from '../../types'

export function findAllByUserId(userId: string): Conversation[] {
  return store.conversations.filter(c =>
    c.participants.some(p => p.id === userId)
  )
}

export function findByParticipants(userIdA: string, userIdB: string): Conversation | undefined {
  return store.conversations.find(c =>
    c.participants.some(p => p.id === userIdA) &&
    c.participants.some(p => p.id === userIdB)
  )
}

export function findById(id: string): Conversation | undefined {
  return store.conversations.find(c => c.id === id)
}

export function updatePinned(id: string, pinned: boolean): Conversation | undefined {
  const conversation = store.conversations.find(c => c.id === id)
  if (!conversation) return undefined

  conversation.pinnedAt = pinned ? new Date().toISOString() : null
  return conversation
}

export function updateLastMessage(
  id: string,
  lastMessage: { content: string; sentAt: string; senderId: string }
): void {
  const conversation = store.conversations.find(c => c.id === id)
  if (!conversation) return
  conversation.lastMessage = lastMessage
  conversation.lastMessageAt = lastMessage.sentAt
}

export function createConversation(participants: User[]): Conversation {
  const conversation: Conversation = {
    id: uuidv4(),
    participants,
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  }
  store.conversations.push(conversation)
  return conversation
}
