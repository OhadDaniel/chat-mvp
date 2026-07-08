import { useConversationsContext }        from '@/features/conversations/context/conversations.context'
import { ConversationsProvider }         from '@/features/conversations/context/ConversationsProvider'
import { ConversationSidebarContainer }  from '@/features/conversations/components/Sidebar/ConversationSidebarContainer'
import { MessagesPanelContainer }        from '@/features/messages/components/MessagesPanel/MessagesPanelContainer'
import { EditGroupProvider }             from '@/features/conversations/components/EditGroup/EditGroup.context'
import { EditGroup }                     from '@/features/conversations/components/EditGroup/EditGroup'
import { getConversationDisplay }        from '@/features/conversations/utils/conversations.utils'
import { useAuth }                       from '@/features/auth/hooks/useAuth'
import { useAppLayout }                  from './hooks/useAppLayout'
import { AppLayout }                     from './AppLayout'

function AppLayoutInner() {
  const { conversations, selectedConversationId } = useConversationsContext()
  const { user } = useAuth()

  const selectedConversation     = conversations.find(c => c.id === selectedConversationId) ?? null
  const selectedConversationName = selectedConversation && user
    ? getConversationDisplay(selectedConversation, user.id).title
    : null

  const editableGroup =
    selectedConversation?.type === 'group' && selectedConversation.createdBy === user?.id
      ? selectedConversation
      : null

  return (
    <AppLayout>
      <ConversationSidebarContainer />
      <MessagesPanelContainer
        conversationId={selectedConversationId}
        conversationName={selectedConversationName}
        actions={editableGroup && (
          <EditGroupProvider key={editableGroup.id} group={editableGroup}>
            <EditGroup />
          </EditGroupProvider>
        )}
      />
    </AppLayout>
  )
}

export function AppLayoutContainer() {
  const contextValue = useAppLayout()

  return (
    <ConversationsProvider value={contextValue}>
      <AppLayoutInner />
    </ConversationsProvider>
  )
}
