import { http, HttpResponse } from 'msw'
import { store, USERS } from '@/mocks/data/seed'
import { API_BASE_URL, MESSAGE_MAX_LENGTH } from '@/shared/constants'

/** Deterministic MSW handler — no random send failures (unlike the dev mock). */
export function createSuccessfulMessagePostHandler() {
  return http.post(`${API_BASE_URL}/conversations/:id/messages`, async ({ params, request }) => {
    const { id }      = params as { id: string }
    const { content } = await request.json() as { content: string }

    if (!content?.trim()) {
      return HttpResponse.json({ error: 'CONTENT_REQUIRED' }, { status: 400 })
    }

    if (content.length > MESSAGE_MAX_LENGTH) {
      return HttpResponse.json({ error: 'CONTENT_TOO_LONG' }, { status: 400 })
    }

    const token  = request.headers.get('Authorization')?.replace('Bearer ', '')
    const userId = token?.replace('mock-token-', '')
    const sender = USERS.find(u => u.id === userId) ?? USERS[0]

    const message = {
      id:             `msg-${Date.now()}`,
      conversationId: id,
      sender,
      content,
      sentAt:         new Date().toISOString(),
      status:         'sent' as const,
    }

    if (!store.messages[id]) store.messages[id] = []
    store.messages[id].push(message)

    const conversation = store.conversations.find(c => c.id === id)
    if (conversation) {
      conversation.lastMessage   = { content, sentAt: message.sentAt, senderId: sender.id }
      conversation.lastMessageAt = message.sentAt
    }

    return HttpResponse.json({ message }, { status: 201 })
  })
}

export function createSuccessfulMessagesGetHandler() {
  return http.get(`${API_BASE_URL}/conversations/:id/messages`, async ({ params }) => {
    const { id } = params as { id: string }
    return HttpResponse.json({
      messages:   store.messages[id] ?? [],
      nextCursor: null,
    })
  })
}
