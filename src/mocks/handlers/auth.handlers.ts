import { http, HttpResponse } from 'msw'
import { USERS }              from '@/mocks/data/seed'
import { API_BASE_URL }       from '@/shared/constants'

export const authHandlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const { name } = await request.json() as { name: string; password: string }

    const user = USERS.find(u => u.name.toLowerCase() === name.trim().toLowerCase())

    if (!user) {
      return HttpResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 })
    }

    return HttpResponse.json({
      token: `mock-token-${user.id}`,
      user,
    })
  }),
]
