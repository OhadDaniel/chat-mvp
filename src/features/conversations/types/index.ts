import type { User }                                       from '@/features/user/types'
import { CONVERSATIONS_ACTIONS, CONVERSATIONS_STATUS }      from '../constants'

export type Conversation = {
  id:            string
  participants:  User[]
  lastMessage: {
    content:  string
    sentAt:   string
    senderId: string
  } | null
  lastMessageAt: string | null
  pinnedAt:      string | null
  unreadCount:   number
}

export type ConversationsStatus = typeof CONVERSATIONS_STATUS[keyof typeof CONVERSATIONS_STATUS]

export type ConversationsState = {
  conversations: Conversation[]
  search:        string
  status:        ConversationsStatus
}

type SetConversationsAction = {
  type:    typeof CONVERSATIONS_ACTIONS.SET_CONVERSATIONS
  payload: Conversation[]
}

type SetStatusAction = {
  type:    typeof CONVERSATIONS_ACTIONS.SET_STATUS
  payload: ConversationsStatus
}

type SetSearchAction = {
  type:    typeof CONVERSATIONS_ACTIONS.SET_SEARCH
  payload: string
}

type TogglePinAction = {
  type:    typeof CONVERSATIONS_ACTIONS.TOGGLE_PIN
  payload: { id: string; pinnedAt: string | null }
}

export type ConversationsAction =
  | SetConversationsAction
  | SetStatusAction
  | SetSearchAction
  | TogglePinAction

export type UseConversationsReturn = {
  conversations: Conversation[]
  status:        ConversationsStatus
  search:        string
  setSearch:     (value: string) => void
  togglePin:     (id: string, currentlyPinned: boolean) => Promise<void>
}
