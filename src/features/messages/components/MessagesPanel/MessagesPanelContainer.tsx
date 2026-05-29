import { useMessages }              from '@/features/messages/hooks/useMessages'
import { MESSAGES_STATUS }          from '@/features/messages/constants'
import { MessageListContainer }     from '../MessageList/MessageListContainer'
import { MessageComposerContainer } from '../MessageComposer/MessageComposerContainer'
import { SkeletonContainer }        from '../Skeleton/SkeletonContainer'
import { NoMessages }               from '../EmptyState/NoMessages/NoMessages'
import { NoConversationSelected }   from '../EmptyState/NoConversationSelected/NoConversationSelected'
import { MessagesLoadError }        from '../EmptyState/MessagesLoadError/MessagesLoadError'
import { MessagesPanel }            from './MessagesPanel'
import type { MessagesPanelContainerProps } from './types'

const DEFAULT_TITLE = 'Select a conversation'

export function MessagesPanelContainer({ conversationId, conversationName }: MessagesPanelContainerProps) {
  const { messages, status, sendMessage, retryLoadMessages } = useMessages(conversationId)

  const isLoading   = status === MESSAGES_STATUS.LOADING
  const isError     = status === MESSAGES_STATUS.ERROR
  const isComposerDisabled = isLoading || isError

  const contentNode = !conversationId
    ? <NoConversationSelected />
    : isLoading
    ? <SkeletonContainer />
    : isError
    ? <MessagesLoadError onRetry={retryLoadMessages} isRetrying={isLoading} />
    : messages.length === 0
    ? <NoMessages />
    : <MessageListContainer messages={messages} />

  const composerNode = conversationId
    ? <MessageComposerContainer sendMessage={sendMessage} isDisabled={isComposerDisabled} />
    : null

  return (
    <MessagesPanel
      title={conversationName ?? DEFAULT_TITLE}
      contentNode={contentNode}
      composerNode={composerNode}
    />
  )
}
