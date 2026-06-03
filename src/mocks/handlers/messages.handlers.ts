import { http, HttpResponse } from 'msw'
import { store, USERS } from '@/mocks/data/seed'
import { API_BASE_URL, MOCK_DELAY_MS, MESSAGES_PAGE_SIZE, MESSAGE_MAX_LENGTH } from '@/shared/constants'

export const messagesHandlers = [

  // GET /conversations/:id/messages?cursor=&limit=
  http.get(`${API_BASE_URL}/conversations/:id/messages`, async ({ params, request }) => {
    await delay(MOCK_DELAY_MS)

    const { id } = params as { id: string }
    const url    = new URL(request.url)
    const cursor = url.searchParams.get('cursor')
    const limit  = Number(url.searchParams.get('limit')) || MESSAGES_PAGE_SIZE

    const all = store.messages[id]

    if (!all) {
      return HttpResponse.json({ error: 'CONVERSATION_NOT_FOUND' }, { status: 404 })
    }

    // Cursor points to the oldest message already loaded — return the page before it
    const cursorIndex = cursor ? all.findIndex(m => m.id === cursor) : all.length
    const end         = cursorIndex === -1 ? all.length : cursorIndex
    const start       = Math.max(0, end - limit)
    const page        = all.slice(start, end)
    const nextCursor  = start > 0 ? all[start].id : null

    return HttpResponse.json({ messages: page, nextCursor })
  }),

 
  http.post(`${API_BASE_URL}/conversations/:id/messages`, async ({ params, request }) => {
    await delay(MOCK_DELAY_MS)

   
    if (Math.random() < 0.2) {
      return HttpResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 })
    }

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
      conversation.lastMessage    = { content, sentAt: message.sentAt, senderId: sender.id }
      conversation.lastMessageAt  = message.sentAt
    }

    return HttpResponse.json({ message }, { status: 201 })
  }),

]

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
