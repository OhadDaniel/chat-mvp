import { request } from '@/api/client'
import type { Conversation } from '@/features/conversations/types/index'

export type GetConversationsResponse = {
  conversations: Conversation[]
}

export type PatchConversationRequest = {
  pinned: boolean
}

export type PatchConversationResponse = {
  conversation: Conversation
}

export const conversationsApi = {
  getAll: (search?: string): Promise<GetConversationsResponse> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return request(`/conversations${params}`)
  },

  patch: (
    id: string,
    body: PatchConversationRequest,
  ): Promise<PatchConversationResponse> =>
    request(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
}
