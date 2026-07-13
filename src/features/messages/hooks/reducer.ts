import { MESSAGES_ACTIONS, MESSAGES_STATUS }          from '../constants'
import type { MessagesState, MessagesAction }          from '../types'

export const initialState: MessagesState = {
  messages:     [],
  status:       MESSAGES_STATUS.IDLE,
  toolActivity: null,
}

export function messagesReducer(
  state:  MessagesState,
  action: MessagesAction,
): MessagesState {
  switch (action.type) {
    case MESSAGES_ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload }

    case MESSAGES_ACTIONS.SET_STATUS:
      return { ...state, status: action.payload }

    case MESSAGES_ACTIONS.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] }

    case MESSAGES_ACTIONS.CONFIRM_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload.tempId ? action.payload.message : m
        ),
      }

    case MESSAGES_ACTIONS.REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.payload),
      }

    case MESSAGES_ACTIONS.APPEND_DELTA:
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload.id
            ? { ...m, content: m.content + action.payload.text }
            : m,
        ),
      }

    case MESSAGES_ACTIONS.TOOL_STARTED:
      return { ...state, toolActivity: { name: action.payload.name } }

    case MESSAGES_ACTIONS.TOOL_FINISHED:
      return { ...state, toolActivity: null }

    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
