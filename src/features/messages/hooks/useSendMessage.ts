import { useToastContext }               from '@/features/app/Toast/context/ToastContext'
import { MESSAGES_ACTIONS }              from '../constants'
import { postMessage, buildOptimisticMessage } from '../utils/messages.utils'
import type { MessagesAction }           from '../types'
import type { User }                     from '@/features/user/types'

const SEND_ERROR_MESSAGE = 'Failed to send message'

export function useSendMessage(
  conversationId: string | null,
  user:           User | null,
  dispatch:       React.Dispatch<MessagesAction>,
) {
  const { showToast } = useToastContext()

  async function sendMessage(content: string) {
    if (!conversationId || !user) return

    const tempId            = `temp-${Date.now()}`
    const optimisticMessage = buildOptimisticMessage(conversationId, content, user, tempId)

    dispatch({ type: MESSAGES_ACTIONS.ADD_MESSAGE, payload: optimisticMessage })

    try {
      const confirmed = await postMessage(conversationId, content)
      dispatch({ type: MESSAGES_ACTIONS.CONFIRM_MESSAGE, payload: { tempId, message: confirmed } })
    } catch {
      dispatch({ type: MESSAGES_ACTIONS.REMOVE_MESSAGE, payload: tempId })
      showToast(SEND_ERROR_MESSAGE)
    }
  }

  return { sendMessage }
}
