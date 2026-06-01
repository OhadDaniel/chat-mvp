import type { User }                          from '@/features/user/types'
import { MESSAGES_ACTIONS, MESSAGES_STATUS }  from '../constants'

export type MessageStatus = 'sent' | 'sending' | 'failed'

export type Message = {
  id:             string
  conversationId: string
  sender:         User
  content:        string
  sentAt:         string
  status:         MessageStatus
}

export type MessagesStatus = typeof MESSAGES_STATUS[keyof typeof MESSAGES_STATUS]

export type MessagesState = {
  messages: Message[]
  status:   MessagesStatus
}

type SetMessagesAction = {
  type:    typeof MESSAGES_ACTIONS.SET_MESSAGES
  payload: Message[]
}

type SetStatusAction = {
  type:    typeof MESSAGES_ACTIONS.SET_STATUS
  payload: MessagesStatus
}

type AddMessageAction = {
  type:    typeof MESSAGES_ACTIONS.ADD_MESSAGE
  payload: Message
}

type ConfirmMessageAction = {
  type:    typeof MESSAGES_ACTIONS.CONFIRM_MESSAGE
  payload: { tempId: string; message: Message }
}

type RemoveMessageAction = {
  type:    typeof MESSAGES_ACTIONS.REMOVE_MESSAGE
  payload: string
}

export type MessagesAction =
  | SetMessagesAction
  | SetStatusAction
  | AddMessageAction
  | ConfirmMessageAction
  | RemoveMessageAction

export type UseMessagesReturn = {
  messages:    Message[]
  status:      MessagesStatus
  sendMessage: (content: string) => Promise<void>
}
