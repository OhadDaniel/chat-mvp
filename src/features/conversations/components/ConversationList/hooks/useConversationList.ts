import { useConversationsContext }   from '@/features/conversations/context/conversations.context'
import { getViewState }              from '../utils/conversationList.utils'
import type { ViewState }            from '../ConversationList.types'
import type { Conversation }         from '@/features/conversations/types/index'

type UseConversationListReturn = {
  viewState:     ViewState
  conversations: Conversation[]
}

export function useConversationList(): UseConversationListReturn {
  const { conversations, status } = useConversationsContext()

  const viewState = getViewState(status, conversations.length)

  return { viewState, conversations }
}
