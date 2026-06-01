import { useCallback, useEffect, useState } from 'react'
import { useToastContext }                   from '@/features/app/Toast/context/ToastContext'
import { MESSAGES_ACTIONS, MESSAGES_STATUS } from '../constants'
import { loadConversationMessages }          from '../utils/messages.utils'
import type { MessagesAction }               from '../types'

const FETCH_ERROR_MESSAGE = 'Failed to load messages'

export function useFetchMessages(
  conversationId: string | null,
  dispatch:       React.Dispatch<MessagesAction>,
) {
  const { showToast } = useToastContext()
  const [retryKey, setRetryKey] = useState(0)

  const retryFetch = useCallback(() => {
    setRetryKey(key => key + 1)
  }, [])

  useEffect(() => {
    if (!conversationId) return

    dispatch({ type: MESSAGES_ACTIONS.SET_STATUS, payload: MESSAGES_STATUS.LOADING })

    loadConversationMessages(conversationId)
      .then((messages) => {
        dispatch({ type: MESSAGES_ACTIONS.SET_MESSAGES, payload: messages })
        dispatch({ type: MESSAGES_ACTIONS.SET_STATUS,   payload: MESSAGES_STATUS.IDLE })
      })
      .catch(() => {
        dispatch({ type: MESSAGES_ACTIONS.SET_STATUS, payload: MESSAGES_STATUS.ERROR })
        showToast(FETCH_ERROR_MESSAGE)
      })
  }, [conversationId, retryKey, dispatch, showToast])

  return { retryFetch }
}
