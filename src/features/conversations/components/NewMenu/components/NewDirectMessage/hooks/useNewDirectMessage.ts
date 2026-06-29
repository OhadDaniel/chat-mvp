import { useState } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { conversationsApi } from '@/features/conversations/api/conversations.api'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { useUserDirectory } from '@/features/user/hooks/useUserDirectory'
import { NEW_DM_ERROR_TOAST } from '../NewDirectMessage.constants'

export function useNewDirectMessage() {
  const { showToast } = useToastContext()
  const { conversations, addConversation, onSelectConversation } = useConversationsContext()
  const { users, search, setSearch } = useUserDirectory()

  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const open = (): void => setIsOpen(true)

  const close = (): void => {
    setIsOpen(false)
    setSearch('')
  }

  const existingDirectWith = (otherId: string) =>
    conversations.find(
      c => c.type === 'direct' && c.participants.some(p => p.id === otherId),
    )

  const selectUser = async (otherId: string): Promise<void> => {
    const existing = existingDirectWith(otherId)
    if (existing) {
      onSelectConversation(existing.id)
      close()
      return
    }

    setBusy(true)
    try {
      const { conversation } = await conversationsApi.createDirect({ participantId: otherId })
      addConversation(conversation)
      onSelectConversation(conversation.id)
      close()
    } catch {
      showToast(NEW_DM_ERROR_TOAST)
    } finally {
      setBusy(false)
    }
  }

  return { isOpen, open, close, users, search, setSearch, selectUser, busy }
}
