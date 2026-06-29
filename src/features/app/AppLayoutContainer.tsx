import { useConversationsContext }        from '@/features/conversations/context/conversations.context'
import { ConversationsProvider }         from '@/features/conversations/context/ConversationsProvider'
import { ConversationSidebarContainer }  from '@/features/conversations/components/Sidebar/ConversationSidebarContainer'
import { MessagesPanelContainer }        from '@/features/messages/components/MessagesPanel/MessagesPanelContainer'
import { EditGroupProvider }             from '@/features/conversations/components/EditGroup/EditGroup.context'
import { EditGroup }                     from '@/features/conversations/components/EditGroup/EditGroup'
import { KnowledgePanelProvider }        from '@/features/conversations/components/KnowledgePanel/KnowledgePanel.context'
import { KnowledgePanel }                from '@/features/conversations/components/KnowledgePanel/KnowledgePanel'
import { EditTutorProvider }             from '@/features/conversations/components/EditTutor/EditTutor.context'
import { EditTutor }                     from '@/features/conversations/components/EditTutor/EditTutor'
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

  const tutor =
    selectedConversation?.type === 'tutor' ? selectedConversation : null

  const headerActions = editableGroup ? (
    <EditGroupProvider key={editableGroup.id} group={editableGroup}>
      <EditGroup />
    </EditGroupProvider>
  ) : tutor ? (
    <>
      <KnowledgePanelProvider key={`knowledge-${tutor.id}`} tutorId={tutor.id}>
        <KnowledgePanel />
      </KnowledgePanelProvider>
      <EditTutorProvider key={`edit-${tutor.id}`} tutor={tutor}>
        <EditTutor />
      </EditTutorProvider>
    </>
  ) : null

  return (
    <AppLayout>
      <ConversationSidebarContainer />
      <MessagesPanelContainer
        conversationId={selectedConversationId}
        conversationName={selectedConversationName}
        actions={headerActions}
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
