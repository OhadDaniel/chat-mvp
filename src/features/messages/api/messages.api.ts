import { request } from '@/api/client'
import { MESSAGES_PAGE_SIZE } from '@/shared/constants'
import type { Message } from '@/features/messages/types'

export type GetMessagesResponse = {
  messages: Message[]
  nextCursor: string | null
}

export type SendMessageRequest = {
  content: string
}

export type SendMessageResponse = {
  message: Message
}

export const messagesApi = {
  getPage: (
    conversationId: string,
    cursor?: string,
  ): Promise<GetMessagesResponse> => {
    const params = new URLSearchParams()
    if (cursor) params.set('cursor', cursor)
    params.set('limit', String(MESSAGES_PAGE_SIZE))
    return request(`/conversations/${conversationId}/messages?${params}`)
  },

  send: (
    conversationId: string,
    body: SendMessageRequest,
  ): Promise<SendMessageResponse> =>
    request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
