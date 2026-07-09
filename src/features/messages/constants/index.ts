import { ASSISTANT_AVATAR_URL } from '@/shared/constants'
import type { User } from '@/features/user/types'

export const MESSAGES_ACTIONS = {
  SET_MESSAGES:    'SET_MESSAGES',
  SET_STATUS:      'SET_STATUS',
  ADD_MESSAGE:     'ADD_MESSAGE',
  CONFIRM_MESSAGE: 'CONFIRM_MESSAGE',
  REMOVE_MESSAGE:  'REMOVE_MESSAGE',
  APPEND_DELTA:    'APPEND_DELTA',
  TOOL_STARTED:    'TOOL_STARTED',
  TOOL_FINISHED:   'TOOL_FINISHED',
} as const

export const MESSAGES_STATUS = {
  IDLE:    'idle',
  LOADING: 'loading',
  ERROR:   'error',
} as const

export const ASSISTANT_SENDER: User = {
  id:             'assistant',
  email:          '',
  firstName:      'Maxwell',
  lastName:       '',
  name:           'Maxwell',
  avatarInitials: 'M',
  avatarUrl:      ASSISTANT_AVATAR_URL,
}
