import { useState }           from 'react'
import { useConversations }   from '@/features/conversations/hooks/useConversations'

export function useAppLayout() {
  const data = useConversations()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return {
    ...data,
    selectedConversationId,
    onSelectConversation: setSelectedConversationId,
  }
}
