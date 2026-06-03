import type { Conversation } from '../../types'

export type GetConversationsQuery = {
  search?: string
}

export type GetConversationsResponse = {
  conversations: Conversation[]
}

export type PatchConversationRequest = {
  pinned: boolean
}

export type PatchConversationResponse = {
  conversation: Conversation
}

export type CreateConversationRequest = {
  participantId: string
}

export type CreateConversationResponse = {
  conversation: Conversation
}
