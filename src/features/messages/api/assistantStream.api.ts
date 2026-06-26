import { API_BASE_URL, STORAGE_KEY_TOKEN } from '@/shared/constants'

export type SseFrame = { event: string; data: string }

export type AssistantStreamHandlers = {
  onDelta: (text: string) => void
  onDone:  (messageId: string) => void
  onError: () => void
}

const FRAME_SEPARATOR = '\n\n'
const EVENT_PREFIX = 'event:'
const DATA_PREFIX = 'data:'
const EVENT_DELTA = 'delta'
const EVENT_DONE = 'done'
const EVENT_ERROR = 'error'

export function parseSseFrames(buffer: string): {
  frames: SseFrame[]
  rest:   string
} {
  const blocks = buffer.split(FRAME_SEPARATOR)
  const rest = blocks.pop() ?? ''
  const frames = blocks
    .map(parseFrame)
    .filter((frame): frame is SseFrame => frame !== null)
  return { frames, rest }
}

function parseFrame(block: string): SseFrame | null {
  let event = ''
  let data = ''
  for (const line of block.split('\n')) {
    if (line.startsWith(EVENT_PREFIX)) {
      event = line.slice(EVENT_PREFIX.length).trim()
    } else if (line.startsWith(DATA_PREFIX)) {
      data += line.slice(DATA_PREFIX.length).trim()
    }
  }
  return event ? { event, data } : null
}

export async function streamAssistantReply(
  conversationId: string,
  content:        string,
  handlers:       AssistantStreamHandlers,
): Promise<void> {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/assistant`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
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
      for (const frame of frames) dispatchFrame(frame, handlers)
    }
  } catch {
    handlers.onError()
  }
}

function dispatchFrame(frame: SseFrame, handlers: AssistantStreamHandlers): void {
  if (frame.event === EVENT_DELTA) {
    handlers.onDelta((JSON.parse(frame.data) as { text: string }).text)
  } else if (frame.event === EVENT_DONE) {
    handlers.onDone((JSON.parse(frame.data) as { messageId: string }).messageId)
  } else if (frame.event === EVENT_ERROR) {
    handlers.onError()
  }
}
