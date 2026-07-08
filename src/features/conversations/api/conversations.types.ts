import type { Conversation } from '@/features/conversations/types'

export type GetConversationsResponse = {
  conversations: Conversation[]
}

export type ConversationResponse = {
  conversation: Conversation
}

export type CreateDirectRequest = {
  participantId: string
}

export type CreateGroupRequest = {
  name:           string
  participantIds: string[]
}

export type RenameGroupRequest = {
  name: string
}

export type PatchConversationRequest = {
  pinned: boolean
}

export type RequestGroupAvatarUploadRequest = {
  contentType: string
}

export type RequestGroupAvatarUploadResponse = {
  url:    string
  fields: Record<string, string>
}
