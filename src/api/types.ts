import type { User } from '@/features/user/types'
import type { Conversation } from '@/features/conversations/types/index'
import type { Message } from '@/features/messages/types'

// envelopes: LoginRequest, LoginResponse, GetConversationsResponse...
// error codes: ApiErrorCode, ApiError


export type LoginRequest = {
  name:     string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
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



export type ApiErrorCode =
  | 'USER_NOT_FOUND'
  | 'CONVERSATION_NOT_FOUND'
  | 'MESSAGE_NOT_FOUND'
  | 'CONTENT_REQUIRED'
  | 'CONTENT_TOO_LONG'
  | 'NOT_MESSAGE_AUTHOR'

export type ApiError = {
  error: ApiErrorCode
}
