import { API_BASE_URL, STORAGE_KEY_TOKEN } from '@/shared/constants'
import { parseSseFrames, type SseFrame } from './sse.helpers'
import {
  SSE_EVENT_DELTA,
  SSE_EVENT_DONE,
  SSE_EVENT_ERROR,
  SSE_EVENT_TOOL_CALL,
  SSE_EVENT_TOOL_RESULT,
} from './sse.constants'
import type { Citation } from '@/features/messages/types'

export type AgentToolEvent = {
  id:   string
  name: string
}

export type AgentStreamHandlers = {
  onDelta:      (text: string) => void
  onToolCall:   (tool: AgentToolEvent) => void
  onToolResult: (tool: AgentToolEvent) => void
  onDone:       (messageId: string, citations: Citation[]) => void
  onError:      () => void
}

export async function streamAgentReply(
  conversationId: string,
  handlers:       AgentStreamHandlers,
): Promise<void> {
  let settled = false
  const markSettled = () => {
    settled = true
  }

  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/assistant`,
      {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    )

    if (!response.ok || !response.body) {
      handlers.onError()
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const { frames, rest } = parseSseFrames(buffer)
      buffer = rest
      for (const frame of frames) dispatchFrame(frame, handlers, markSettled)
    }

    if (!settled) handlers.onError()
  } catch {
    if (!settled) handlers.onError()
  }
}

function dispatchFrame(
  frame:       SseFrame,
  handlers:    AgentStreamHandlers,
  markSettled: () => void,
): void {
  if (frame.event === SSE_EVENT_DELTA) {
    handlers.onDelta((JSON.parse(frame.data) as { text: string }).text)
  } else if (frame.event === SSE_EVENT_TOOL_CALL) {
    handlers.onToolCall(JSON.parse(frame.data) as AgentToolEvent)
  } else if (frame.event === SSE_EVENT_TOOL_RESULT) {
    handlers.onToolResult(JSON.parse(frame.data) as AgentToolEvent)
  } else if (frame.event === SSE_EVENT_DONE) {
    markSettled()
    const done = JSON.parse(frame.data) as {
      messageId: string
      citations?: Citation[]
    }
    handlers.onDone(done.messageId, done.citations ?? [])
  } else if (frame.event === SSE_EVENT_ERROR) {
    markSettled()
    handlers.onError()
  }
}
