import type { Message } from '../../types'

export type GetMessagesResponse = {
  messages: Message[]
  nextCursor: string | null
}

export type CreateMessageRequest = {
  content: string
}

export type CreateMessageResponse = {
  message: Message
}

