import { useState } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { conversationsApi } from '@/features/conversations/api/conversations.api'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { NEW_TUTOR_ERROR_TOAST } from '../NewTutor.constants'

export function useNewTutor() {
  const { showToast } = useToastContext()
  const { addConversation, onSelectConversation } = useConversationsContext()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  const open = (): void => setIsOpen(true)

  const close = (): void => {
    setIsOpen(false)
    setName('')
  }

  const canCreate = name.trim().length > 0 && !busy

  const create = async (): Promise<void> => {
    setBusy(true)
    try {
      const { conversation } = await conversationsApi.createTutor({
        name: name.trim(),
      })
      addConversation(conversation)
      onSelectConversation(conversation.id)
      close()
    } catch {
      showToast(NEW_TUTOR_ERROR_TOAST)
    } finally {
      setBusy(false)
    }
  }

  return { isOpen, open, close, name, setName, canCreate, busy, create }
}
