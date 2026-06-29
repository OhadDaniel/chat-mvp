import { API_BASE_URL, STORAGE_KEY_TOKEN } from '@/shared/constants'
import { parseSseFrames, type SseFrame } from './sse.helpers'
import {
  SSE_EVENT_DELTA,
  SSE_EVENT_DONE,
  SSE_EVENT_ERROR,
} from './sse.constants'
import type { Citation } from '@/features/messages/types'

export type AssistantStreamHandlers = {
  onDelta: (text: string) => void
  onDone:  (messageId: string, citations: Citation[]) => void
  onError: () => void
}

export async function streamAssistantReply(
  conversationId: string,
  handlers:       AssistantStreamHandlers,
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
  handlers:    AssistantStreamHandlers,
  markSettled: () => void,
): void {
  if (frame.event === SSE_EVENT_DELTA) {
    handlers.onDelta((JSON.parse(frame.data) as { text: string }).text)
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
