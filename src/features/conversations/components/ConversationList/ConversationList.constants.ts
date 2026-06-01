import type { ViewState } from './ConversationList.types'

export const VIEW_STATE: Record<string, ViewState> = {
  LOADING: 'loading',
  EMPTY:   'empty',
  READY:   'ready',
  ERROR:   'error',
}

export const CONVERSATION_LIST_CLASS   = 'flex-1 overflow-y-auto'
export const CONVERSATION_LIST_ERROR   = 'Failed to load conversations'
export const CONVERSATION_LIST_ERROR_CLASS = 'flex-1 flex items-center justify-center text-sm text-red-400 px-4 text-center'
