import { useState } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { conversationsApi } from '@/features/conversations/api/conversations.api'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { useUserDirectory } from '@/features/user/hooks/useUserDirectory'
import { NEW_GROUP_ERROR_TOAST } from '../NewGroup.constants'

export function useNewGroup() {
  const { showToast } = useToastContext()
  const { addConversation, onSelectConversation } = useConversationsContext()
  const { users, search, setSearch } = useUserDirectory()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  const open = (): void => setIsOpen(true)

  const close = (): void => {
    setIsOpen(false)
    setName('')
    setSelectedIds([])
    setSearch('')
  }

  const isSelected = (id: string): boolean => selectedIds.includes(id)

  const toggle = (id: string): void =>
    setSelectedIds(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id],
    )

  const canCreate = name.trim().length > 0 && !busy

  const create = async (): Promise<void> => {
    setBusy(true)
    try {
      const { conversation } = await conversationsApi.createGroup({
        name: name.trim(),
        participantIds: selectedIds,
      })
      addConversation(conversation)
      onSelectConversation(conversation.id)
      close()
    } catch {
      showToast(NEW_GROUP_ERROR_TOAST)
    } finally {
      setBusy(false)
    }
  }

  return {
    isOpen,
    open,
    close,
    name,
    setName,
    users,
    search,
    setSearch,
    isSelected,
    toggle,
    canCreate,
    busy,
    create,
  }
}
