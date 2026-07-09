import { useState } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { streamAgentReply } from '@/api/agentStream.api'
import { MESSAGES_ACTIONS, ASSISTANT_SENDER } from '../constants'
import {
  buildOptimisticMessage,
  buildAssistantPlaceholder,
  postMessage,
} from '../utils/messages.utils'
import type { Citation, Message, MessagesAction } from '../types'
import type { User } from '@/features/user/types'

const SEND_ERROR_MESSAGE = 'The assistant could not reply — please try again'

export function useSendAgentMessage(
  conversationId: string | null,
  user:           User | null,
  dispatch:       React.Dispatch<MessagesAction>,
) {
  const { showToast } = useToastContext()
  const [isStreaming, setIsStreaming] = useState(false)

  async function sendMessage(content: string) {
    if (!conversationId || !user) return

    const userTempId      = `temp-${Date.now()}`
    const assistantTempId = `temp-assistant-${Date.now()}`
    const userMessage     = buildOptimisticMessage(conversationId, content, user, userTempId)

    const rollback = () => {
      dispatch({ type: MESSAGES_ACTIONS.REMOVE_MESSAGE, payload: userTempId })
      dispatch({ type: MESSAGES_ACTIONS.REMOVE_MESSAGE, payload: assistantTempId })
      showToast(SEND_ERROR_MESSAGE)
    }

    dispatch({ type: MESSAGES_ACTIONS.ADD_MESSAGE, payload: userMessage })
    dispatch({
      type:    MESSAGES_ACTIONS.ADD_MESSAGE,
      payload: buildAssistantPlaceholder(conversationId, assistantTempId),
    })
    setIsStreaming(true)

    let replyText = ''

    try {
      const confirmedUser = await postMessage(conversationId, content)
      dispatch({
        type:    MESSAGES_ACTIONS.CONFIRM_MESSAGE,
        payload: { tempId: userTempId, message: confirmedUser },
      })

      await streamAgentReply(conversationId, {
        onDelta: (text) => {
          replyText += text
          dispatch({
            type:    MESSAGES_ACTIONS.APPEND_DELTA,
            payload: { id: assistantTempId, text },
          })
        },
        onToolCall: (tool) => {
          dispatch({
            type:    MESSAGES_ACTIONS.TOOL_STARTED,
            payload: { name: tool.name },
          })
        },
        onToolResult: () => {
          dispatch({ type: MESSAGES_ACTIONS.TOOL_FINISHED })
        },
        onDone: (messageId, citations) => {
          dispatch({
            type:    MESSAGES_ACTIONS.CONFIRM_MESSAGE,
            payload: {
              tempId:  assistantTempId,
              message: buildFinalReply(conversationId, messageId, replyText, citations),
            },
          })
        },
        onError: rollback,
      })
    } catch {
      rollback()
    } finally {
      dispatch({ type: MESSAGES_ACTIONS.TOOL_FINISHED })
      setIsStreaming(false)
    }
  }

  return { sendMessage, isStreaming }
}

function buildFinalReply(
  conversationId: string,
  id:             string,
  content:        string,
  citations:      Citation[],
): Message {
  return {
    id,
    conversationId,
    sender:  ASSISTANT_SENDER,
    content,
    sentAt:  new Date().toISOString(),
    status:  'sent',
    citations,
  }
}
