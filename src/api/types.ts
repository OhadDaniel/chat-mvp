import type { User } from '@/features/user/types'
import type { Conversation } from '@/features/conversations/types/index'
import type { Message } from '@/features/messages/types'




export type LoginRequest = {
  email:    string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}

export type SignupRequest = {
  email:    string
  password: string
  name:     string
}

export type SignupResponse = {
  token: string
  user: User
}

export type MeResponse = {
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
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'VALIDATION_ERROR'
  | 'USER_NOT_FOUND'
  | 'CONVERSATION_NOT_FOUND'
  | 'CONVERSATION_ALREADY_EXISTS'
  | 'INVALID_PARTICIPANT'
  | 'NOT_A_PARTICIPANT'
  | 'INTERNAL_SERVER_ERROR'

export type ApiError = {
  error: {
    code:     ApiErrorCode
    message:  string
    details?: unknown
  }
}
