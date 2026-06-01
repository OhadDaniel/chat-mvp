import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import userEvent                   from '@testing-library/user-event'
import { http, HttpResponse }      from 'msw'
import App                         from '@/App'
import { server }                  from '@/mocks/server'
import { USERS }                   from '@/mocks/data/seed'
import { API_BASE_URL, STORAGE_KEY_TOKEN, STORAGE_KEY_USER } from '@/shared/constants'
import {
  createSuccessfulMessagePostHandler,
  createSuccessfulMessagesGetHandler,
} from '@/test/helpers/mswHandlers'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  server.use(createSuccessfulMessagePostHandler())
})

afterEach(() => {
  server.resetHandlers()
  server.use(createSuccessfulMessagePostHandler())
  localStorage.clear()
})

afterAll(() => server.close())

describe('chat flow integration', () => {
  it('logs in, selects a conversation, loads messages, and sends a message', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)

    await user.type(screen.getByPlaceholderText(/your name/i), 'Ohad Daniel')
    await user.type(screen.getByPlaceholderText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(within(screen.getByRole('list')).getByText('Alice Levi')).toBeInTheDocument()
    })

    await user.click(within(screen.getByRole('list')).getByText('Alice Levi'))

    await waitFor(() => {
      expect(screen.getAllByText(/sounds good, see you then!/i).length).toBeGreaterThan(0)
    }, { timeout: 3000 })

    const textarea = screen.getByPlaceholderText(/write a message/i)
    fireEvent.change(textarea, { target: { value: 'Integration hello' } })
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Integration hello')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows a load error and recovers when retry succeeds', async () => {
    server.use(
      http.get(`${API_BASE_URL}/conversations/:id/messages`, () =>
        HttpResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 }),
      ),
    )

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(USERS[0]))
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock-token-user-1')

    const user = userEvent.setup({ delay: null })
    render(<App />)

    await waitFor(() => {
      expect(within(screen.getByRole('list')).getByText('Alice Levi')).toBeInTheDocument()
    })

    await user.click(within(screen.getByRole('list')).getByText('Alice Levi'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    }, { timeout: 3000 })

    server.use(createSuccessfulMessagesGetHandler())
    await user.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => {
      expect(screen.getAllByText(/sounds good, see you then!/i).length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })
})
