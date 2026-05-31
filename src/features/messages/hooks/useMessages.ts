import { useReducer }               from 'react'
import { useAuth }                  from '@/features/auth/hooks/useAuth'
import { messagesReducer, initialState } from './reducer'
import { useFetchMessages }         from './useFetchMessages'
import { useSendMessage }           from './useSendMessage'

export function useMessages(conversationId: string | null) {
  const { user }          = useAuth()
  const [state, dispatch] = useReducer(messagesReducer, initialState)

  const { retryFetch } = useFetchMessages(conversationId, dispatch)
  const { sendMessage } = useSendMessage(conversationId, user, dispatch)

  return {
    messages:           state.messages,
    status:             state.status,
    sendMessage,
    retryLoadMessages:  retryFetch,
  }
}
