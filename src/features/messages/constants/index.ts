export const MESSAGES_ACTIONS = {
  SET_MESSAGES:    'SET_MESSAGES',
  SET_STATUS:      'SET_STATUS',
  ADD_MESSAGE:     'ADD_MESSAGE',
  CONFIRM_MESSAGE: 'CONFIRM_MESSAGE',
  REMOVE_MESSAGE:  'REMOVE_MESSAGE',
} as const

export const MESSAGES_STATUS = {
  IDLE:    'idle',
  LOADING: 'loading',
  ERROR:   'error',
} as const
