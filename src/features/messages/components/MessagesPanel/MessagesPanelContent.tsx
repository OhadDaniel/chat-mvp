import { useMessagesContext }       from '@/features/messages/context/messages.context'
import { MessageComposerContainer } from './components/Composer/MessageComposerContainer'
import { MessagesPanel }            from './MessagesPanel'
import { useMessagesPanel }         from './hooks/useMessagesPanel'
import { MessageListContent }     from './components/List/MessageListContent'
import { SkeletonContainer }        from '../Skeleton/SkeletonContainer'
import { NoMessages }               from '../EmptyState/NoMessages/NoMessages'
import { NoConversationSelected }   from '../EmptyState/NoConversationSelected/NoConversationSelected'
import { MessagesLoadError }        from '../EmptyState/MessagesLoadError/MessagesLoadError'

export function MessagesPanelContent() {
  const { title, conversationId, panelStatus, retryLoadMessages } = useMessagesPanel()
  const { status } = useMessagesContext()

  return (
    <MessagesPanel title={title}>
      {panelStatus === 'no-conversation' && <NoConversationSelected />}
      {panelStatus === 'loading'         && <SkeletonContainer />}
      {panelStatus === 'error'           && <MessagesLoadError onRetry={retryLoadMessages} isRetrying={status === 'loading'} />}
      {panelStatus === 'empty'           && <NoMessages />}
      {panelStatus === 'ready'           && <MessageListContent />}
      {conversationId                    && <MessageComposerContainer />}
    </MessagesPanel>
  )
}
