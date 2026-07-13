import { useState } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { conversationsApi } from '@/features/conversations/api/conversations.api'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { START_ASSISTANT_ERROR_TOAST } from '../StartAssistant.constants'

export function useStartAssistant() {
  const { showToast } = useToastContext()
  const { conversations, addConversation, onSelectConversation } =
    useConversationsContext()
  const [busy, setBusy] = useState(false)

  async function start(): Promise<void> {
    const existing = conversations.find(c => c.type === 'assistant')
    if (existing) {
      onSelectConversation(existing.id)
      return
    }

    setBusy(true)
    try {
      const { conversation } = await conversationsApi.createAssistant()
      addConversation(conversation)
      onSelectConversation(conversation.id)
    } catch {
      showToast(START_ASSISTANT_ERROR_TOAST)
    } finally {
      setBusy(false)
    }
  }

  return { start, busy }
}
