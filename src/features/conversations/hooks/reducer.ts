import { CONVERSATIONS_ACTIONS, CONVERSATIONS_STATUS } from '../constants'
import { applyTogglePin }                             from '../utils/conversations.utils'
import type { ConversationsState, ConversationsAction } from '../types'

export const initialState: ConversationsState = {
  conversations: [],
  search:        '',
  status:        CONVERSATIONS_STATUS.IDLE,
}

export function conversationsReducer(
  state:  ConversationsState,
  action: ConversationsAction,
): ConversationsState {
  switch (action.type) {
    case CONVERSATIONS_ACTIONS.SET_CONVERSATIONS:
      return { ...state, conversations: action.payload }

    case CONVERSATIONS_ACTIONS.SET_STATUS:
      return { ...state, status: action.payload }

    case CONVERSATIONS_ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload }

    case CONVERSATIONS_ACTIONS.TOGGLE_PIN:
      return {
        ...state,
        conversations: applyTogglePin(
          state.conversations,
          action.payload.id,
          action.payload.pinnedAt,
        ),
      }

    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
