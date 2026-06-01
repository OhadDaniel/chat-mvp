import { http, HttpResponse } from 'msw'
import { store } from '@/mocks/data/seed'
import { API_BASE_URL, MOCK_DELAY_MS } from '@/shared/constants'

export const conversationsHandlers = [

  // GET /conversations?search=
  http.get(`${API_BASE_URL}/conversations`, async ({ request }) => {
    await delay(MOCK_DELAY_MS)

    const url    = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''

    // Get the current user from the auth token
    const token  = request.headers.get('Authorization')?.replace('Bearer ', '')
    const userId = token?.replace('mock-token-', '')

    let conversations = store.conversations.filter(c =>
      c.participants.some(p => p.id === userId),
    )

    if (search) {
      conversations = conversations.filter(c =>
        c.participants
          .filter(p => p.id !== userId)
          .some(p => p.name.toLowerCase().includes(search)),
      )
    }

    return HttpResponse.json({ conversations })
  }),

  // PATCH /conversations/:id  (pin / unpin)
  http.patch(`${API_BASE_URL}/conversations/:id`, async ({ params, request }) => {
    await delay(MOCK_DELAY_MS)

    const { id } = params as { id: string }
    const { pinned } = await request.json() as { pinned: boolean }

    const conversation = store.conversations.find(c => c.id === id)

    if (!conversation) {
      return HttpResponse.json({ error: 'CONVERSATION_NOT_FOUND' }, { status: 404 })
    }

    conversation.pinnedAt = pinned ? new Date().toISOString() : null

    return HttpResponse.json({ conversation })
  }),
]

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
