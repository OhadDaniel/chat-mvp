import type { ReactNode }            from 'react'
import { useAuth }                   from '@/features/auth/hooks/useAuth'
import { useConversationsContext }   from '@/features/conversations/context/conversations.context'
import { buildConversationItems }    from '../../ConversationItem/buildConversationItems'
import { getViewState }              from '../utils/conversationList.utils'
import type { ViewState }            from '../ConversationList.types'

type UseConversationListReturn = {
  viewState: ViewState
  items:     ReactNode[]
}

export function useConversationList(): UseConversationListReturn {
  const { conversations, status, togglePin, selectedConversationId, onSelectConversation } = useConversationsContext()
  const { user } = useAuth()

  const items     = user
    ? buildConversationItems(conversations, togglePin, user, selectedConversationId, onSelectConversation)
    : []
  const viewState = getViewState(status, items.length)

  return { viewState, items }
}
