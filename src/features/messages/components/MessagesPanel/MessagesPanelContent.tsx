import { MessageComposerContainer } from './components/Composer/MessageComposerContainer'
import { MessagesPanel }            from './MessagesPanel'
import { useMessagesPanel }         from './hooks/useMessagesPanel'

export function MessagesPanelContent() {
  const { title, content, conversationId } = useMessagesPanel()

  return (
    <MessagesPanel title={title}>
      {content}
      {conversationId && <MessageComposerContainer />}
    </MessagesPanel>
  )
}
