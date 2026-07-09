import { useMessages }              from '@/features/messages/hooks/useMessages'
import { MESSAGES_STATUS }          from '@/features/messages/constants'
import { MessageListContainer }     from '../MessageList/MessageListContainer'
import { AgentProgressContainer }    from '../AgentProgress/AgentProgressContainer'
import { MessageComposerContainer } from '../MessageComposer/MessageComposerContainer'
import { SkeletonContainer }        from '../Skeleton/SkeletonContainer'
import { NoMessages }               from '../EmptyState/NoMessages/NoMessages'
import { NoConversationSelected }   from '../EmptyState/NoConversationSelected/NoConversationSelected'
import { MessagesLoadError }        from '../EmptyState/MessagesLoadError/MessagesLoadError'
import { MessagesPanel }            from './MessagesPanel'
import type { MessagesPanelContainerProps } from './types'
import type { Message }                    from '@/features/messages/types'

const DEFAULT_TITLE = 'Select a conversation'

function MessageContent({ conversationId, messages, retryLoadMessages, isLoading, isError }: {
  conversationId:    string | null
  messages:          Message[]
  retryLoadMessages: () => void
  isLoading:         boolean
  isError:           boolean
}) {
  if (!conversationId)       return <NoConversationSelected />
  if (isLoading)             return <SkeletonContainer />
  if (isError)               return <MessagesLoadError onRetry={retryLoadMessages} isRetrying={isLoading} />
  if (messages.length === 0) return <NoMessages />
  return <MessageListContainer messages={messages} />
}

export function MessagesPanelContainer({ conversationId, conversationName, actions }: MessagesPanelContainerProps) {
  const { messages, status, sendMessage, retryLoadMessages, isStreaming, toolActivity } =
    useMessages(conversationId)

  const isLoading          = status === MESSAGES_STATUS.LOADING
  const isError            = status === MESSAGES_STATUS.ERROR
  const isComposerDisabled = isLoading || isError || isStreaming

  return (
    <MessagesPanel title={conversationName ?? DEFAULT_TITLE} actions={actions}>
      <MessageContent
        conversationId={conversationId}
        messages={messages}
        retryLoadMessages={retryLoadMessages}
        isLoading={isLoading}
        isError={isError}
      />
      <AgentProgressContainer toolActivity={toolActivity} />
      {conversationId && (
        <MessageComposerContainer sendMessage={sendMessage} isDisabled={isComposerDisabled} />
      )}
    </MessagesPanel>
  )
}
