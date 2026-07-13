import { useReducer }                  from 'react'
import { useAuth }                     from '@/features/auth/hooks/useAuth'
import { useConversationsContext }     from '@/features/conversations/context/conversations.context'
import { messagesReducer, initialState } from './reducer'
import { useFetchMessages }            from './useFetchMessages'
import { useSendMessage }              from './useSendMessage'
import { useSendAgentMessage }         from './useSendAgentMessage'

export function useMessages(conversationId: string | null) {
  const { user }          = useAuth()
  const { conversations } = useConversationsContext()
  const [state, dispatch] = useReducer(messagesReducer, initialState)

  const { retryFetch }                     = useFetchMessages(conversationId, dispatch)
  const { sendMessage: sendDirectMessage } = useSendMessage(conversationId, user, dispatch)
  const { sendMessage: sendAgentMessage, isStreaming } =
    useSendAgentMessage(conversationId, user, dispatch)

  const isAiReply = conversations.some(
    c =>
      c.id === conversationId &&
      (c.type === 'assistant' || c.type === 'tutor'),
  )

  return {
    messages:          state.messages,
    status:            state.status,
    sendMessage:       isAiReply ? sendAgentMessage : sendDirectMessage,
    retryLoadMessages: retryFetch,
    isStreaming:       isAiReply && isStreaming,
    toolActivity:      isAiReply ? state.toolActivity : null,
  }
}
