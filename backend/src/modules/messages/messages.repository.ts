import { store } from '../../store'
import { v4 as uuidv4 } from 'uuid'
import type { Message, User } from '../../types'

export function findByConversationId(conversationId: string): Message[] {
  return store.messages.filter(m => m.conversationId === conversationId)
}

export function findMessageById(id: string): Message | undefined {
  return store.messages.find(m => m.id === id)
}

export function createMessage(conversationId: string, sender: User, content: string): Message {
  const message: Message = {
    id: uuidv4(),
    conversationId,
    sender,
    content,
    sentAt: new Date().toISOString(),
    status: 'sent',
  }
  store.messages.push(message)
  return message
}
