import { useReducer }                  from 'react'
import { useAuth }                     from '@/features/auth/hooks/useAuth'
import { useConversationsContext }     from '@/features/conversations/context/conversations.context'
import { messagesReducer, initialState } from './reducer'
import { useFetchMessages }            from './useFetchMessages'
import { useSendMessage }              from './useSendMessage'
import { useSendAssistantMessage }     from './useSendAssistantMessage'

export function useMessages(conversationId: string | null) {
  const { user }          = useAuth()
  const { conversations } = useConversationsContext()
  const [state, dispatch] = useReducer(messagesReducer, initialState)

  const { retryFetch }                     = useFetchMessages(conversationId, dispatch)
  const { sendMessage: sendDirectMessage } = useSendMessage(conversationId, user, dispatch)
  const { sendMessage: sendAssistantMessage, isStreaming } =
    useSendAssistantMessage(conversationId, user, dispatch)

  const isAssistant = conversations.some(
    c => c.id === conversationId && c.type === 'assistant',
  )

  return {
    messages:          state.messages,
    status:            state.status,
    sendMessage:       isAssistant ? sendAssistantMessage : sendDirectMessage,
    retryLoadMessages: retryFetch,
    isStreaming:       isAssistant && isStreaming,
  }
}
