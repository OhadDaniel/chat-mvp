import type { ReactElement } from 'react'
import { MESSAGES_STATUS }          from '@/features/messages/constants'
import { useConversationsContext }  from '@/features/conversations/context/conversations.context'
import { useMessagesContext }       from '@/features/messages/context/messages.context'
import { MessageListContainer }     from '../components/List/MessageListContainer'
import { SkeletonContainer }        from '../../Skeleton/SkeletonContainer'
import { NoMessages }               from '../../EmptyState/NoMessages/NoMessages'
import { NoConversationSelected }   from '../../EmptyState/NoConversationSelected/NoConversationSelected'
import { MessagesLoadError }        from '../../EmptyState/MessagesLoadError/MessagesLoadError'

const DEFAULT_TITLE = 'Select a conversation'

export function useMessagesPanel(): {
  title:           string
  content:         ReactElement
  conversationId:  string | null
} {
  const { selectedConversationId: conversationId, selectedConversationName: conversationName } = useConversationsContext()
  const { messages, status, retryLoadMessages } = useMessagesContext()

  const isLoading = status === MESSAGES_STATUS.LOADING
  const isError   = status === MESSAGES_STATUS.ERROR
  const title     = conversationName ?? DEFAULT_TITLE

  let content: ReactElement
  if (!conversationId)       content = <NoConversationSelected />
  else if (isLoading)        content = <SkeletonContainer />
  else if (isError)          content = <MessagesLoadError onRetry={retryLoadMessages} isRetrying={isLoading} />
  else if (messages.length === 0) content = <NoMessages />
  else                       content = <MessageListContainer />

  return { title, content, conversationId }
}
