import { useConversationList }   from './hooks/useConversationList'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { useAuth }                from '@/features/auth/hooks/useAuth'
import { ConversationList }       from './ConversationList'

export function ConversationListContainer() {
  const { viewState, conversations }                               = useConversationList()
  const { togglePin, selectedConversationId, onSelectConversation } = useConversationsContext()
  const { user }                                                   = useAuth()

  if (!user) return null

  return (
    <ConversationList
      viewState={viewState}
      conversations={conversations}
      currentUser={user}
      selectedConversationId={selectedConversationId}
      togglePin={togglePin}
      onSelectConversation={onSelectConversation}
    />
  )
}
