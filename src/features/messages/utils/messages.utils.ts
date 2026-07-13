import { messagesApi }    from '@/features/messages/api/messages.api'
import { ASSISTANT_SENDER } from '../constants'
import type { AiSender, Message }   from '../types'
import type { User }      from '@/features/user/types'

export type ApiMessage = Omit<Message, 'status'>

export type BubbleSenderDisplay = {
  name:      string
  initials:  string
  avatarUrl: string | null
}

export function toMessage(apiMsg: ApiMessage): Message {
  return { ...apiMsg, status: 'sent' }
}

export function resolveSenderDisplay(
  message:  Message,
  aiSender: AiSender,
): BubbleSenderDisplay {
  return message.sender.id === ASSISTANT_SENDER.id
    ? {
        name:      aiSender.name,
        initials:  aiSender.initials,
        avatarUrl: aiSender.avatarUrl,
      }
    : {
        name:      message.sender.name,
        initials:  message.sender.avatarInitials,
        avatarUrl: message.sender.avatarUrl,
      }
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

export function buildAssistantPlaceholder(
  conversationId: string,
  tempId:         string,
): Message {
  return {
    id:             tempId,
    conversationId,
    sender:         ASSISTANT_SENDER,
    content:        '',
    sentAt:         new Date().toISOString(),
    status:         'sending',
  }
}
