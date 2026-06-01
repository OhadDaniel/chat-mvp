import { messagesApi }    from '@/api/apiClient'
import type { Message }   from '../types'
import type { User }      from '@/features/user/types'

export type ApiMessage = Omit<Message, 'status'>

export function toMessage(apiMsg: ApiMessage): Message {
  return { ...apiMsg, status: 'sent' }
}

export async function loadConversationMessages(conversationId: string): Promise<Message[]> {
  const { messages } = await messagesApi.getPage(conversationId)
  return messages.map(toMessage)
}

export async function postMessage(conversationId: string, content: string): Promise<Message> {
  const { message } = await messagesApi.send(conversationId, { content })
  return toMessage(message)
}

export function buildOptimisticMessage(
  conversationId: string,
  content:        string,
  user:           User,
  tempId:         string,
): Message {
  return {
    id:             tempId,
    conversationId,
    sender:         user,
    content,
    sentAt:         new Date().toISOString(),
    status:         'sending',
  }
}
