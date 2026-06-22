import { CONVERSATIONS_ACTIONS, CONVERSATIONS_STATUS }   from '../constants'
import { applyTogglePin, applyConversationUpdate }       from '../utils/conversations.utils'
import type { ConversationsState, ConversationsAction }  from '../types'

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

    case CONVERSATIONS_ACTIONS.ADD_CONVERSATION:
      return state.conversations.some(c => c.id === action.payload.id)
        ? state
        : { ...state, conversations: [action.payload, ...state.conversations] }

    case CONVERSATIONS_ACTIONS.UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: applyConversationUpdate(state.conversations, action.payload),
      }

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
