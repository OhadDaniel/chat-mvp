import { useReducer }                               from 'react'
import { conversationsReducer, initialState }       from './reducer'
import { CONVERSATIONS_ACTIONS }                    from '../constants'
import type { Conversation, ConversationsStatus, ConversationsState } from '../types'

type UseConversationsStateReturn = {
  state:             ConversationsState
  setConversations:  (payload: Conversation[]) => void
  setStatus:         (payload: ConversationsStatus) => void
  setSearch:         (payload: string) => void
  applyTogglePin:    (id: string, pinnedAt: string | null) => void
}

export function useConversationsState(): UseConversationsStateReturn {
  const [state, dispatch] = useReducer(conversationsReducer, initialState)

  const setConversations = (payload: Conversation[]) =>
    dispatch({ type: CONVERSATIONS_ACTIONS.SET_CONVERSATIONS, payload })

  const setStatus = (payload: ConversationsStatus) =>
    dispatch({ type: CONVERSATIONS_ACTIONS.SET_STATUS, payload })

  const setSearch = (payload: string) =>
    dispatch({ type: CONVERSATIONS_ACTIONS.SET_SEARCH, payload })

  const applyTogglePin = (id: string, pinnedAt: string | null) =>
    dispatch({ type: CONVERSATIONS_ACTIONS.TOGGLE_PIN, payload: { id, pinnedAt } })

  return { state, setConversations, setStatus, setSearch, applyTogglePin }
}
