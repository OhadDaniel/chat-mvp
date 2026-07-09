import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { MessagesProvider }        from '@/features/messages/context/messages.context'
import { MessagesPanelContent }    from './MessagesPanelContent'

export function MessagesPanelContainer() {
  const { selectedConversationId: conversationId } = useConversationsContext()

  return (
    <MessagesProvider conversationId={conversationId}>
      <MessagesPanelContent />
    </MessagesProvider>
  )
}
