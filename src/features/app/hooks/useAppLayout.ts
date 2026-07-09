import { useState }           from 'react'
import { useConversations }   from '@/features/conversations/hooks/useConversations'
import { useAuth }            from '@/features/auth/context/AuthContext'

export function useAppLayout() {
  const data = useConversations()
  const { user } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const selectedConversation = data.conversations.find(c => c.id === selectedConversationId) ?? null
  const selectedConversationName = selectedConversation
    ? selectedConversation.participants
        .filter(p => p.id !== user?.id)
        .map(p => p.name)
        .join(', ')
    : null

  return {
    ...data,
    selectedConversationId,
    selectedConversation,
    selectedConversationName,
    onSelectConversation: setSelectedConversationId,
  }
}
