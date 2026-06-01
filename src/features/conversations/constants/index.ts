export const CONVERSATIONS_ACTIONS = {
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_STATUS:        'SET_STATUS',
  SET_SEARCH:        'SET_SEARCH',
  TOGGLE_PIN:        'TOGGLE_PIN',
} as const

export const CONVERSATIONS_STATUS = {
  IDLE:    'idle',
  LOADING: 'loading',
  ERROR:   'error',
} as const
