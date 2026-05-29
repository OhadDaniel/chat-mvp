import { useState }                       from 'react'
import { useConversations }               from '@/features/conversations/hooks/useConversations'
import { useConversationsContext }        from '@/features/conversations/context/conversations.context'
import { ConversationsProvider }         from '@/features/conversations/context/ConversationsProvider'
import { ConversationSidebarContainer }  from '@/features/conversations/components/Sidebar/ConversationSidebarContainer'
import { MessagesPanelContainer }        from '@/features/messages/components/MessagesPanel/MessagesPanelContainer'
import { useAuth }                       from '@/features/auth/hooks/useAuth'
import { AppLayout }                     from './AppLayout'

function AppLayoutContent() {
  const { conversations, selectedConversationId } = useConversationsContext()
  const { user } = useAuth()

  const selectedConversation     = conversations.find(c => c.id === selectedConversationId) ?? null
  const selectedConversationName = selectedConversation
    ? selectedConversation.participants
        .filter(p => p.id !== user?.id)
        .map(p => p.name)
        .join(', ')
    : null

  return (
    <AppLayout
      sidebarNode={<ConversationSidebarContainer />}
      panelNode={
        <MessagesPanelContainer
          conversationId={selectedConversationId}
          conversationName={selectedConversationName}
        />
      }
    />
  )
}

export function AppLayoutContainer() {
  const data = useConversations()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <ConversationsProvider value={{ ...data, selectedConversationId, onSelectConversation: setSelectedConversationId }}>
      <AppLayoutContent />
    </ConversationsProvider>
  )
}
