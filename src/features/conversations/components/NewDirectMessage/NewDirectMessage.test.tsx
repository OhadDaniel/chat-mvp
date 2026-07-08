import { describe, it, expect, vi }            from 'vitest'
import { render, screen }                       from '@testing-library/react'
import userEvent                                from '@testing-library/user-event'
import { NewDirectMessage }                     from './NewDirectMessage'
import { NewDirectMessageContext }              from './NewDirectMessage.context'
import type { NewDirectMessageContextValue }    from './NewDirectMessage.types'

const baseValue: NewDirectMessageContextValue = {
  isOpen:    false,
  open:      vi.fn(),
  close:     vi.fn(),
  users:     [],
  search:    '',
  setSearch: vi.fn(),
  selectUser: vi.fn(),
  busy:      false,
}

function renderWith(overrides: Partial<NewDirectMessageContextValue> = {}) {
  return render(
    <NewDirectMessageContext.Provider value={{ ...baseValue, ...overrides }}>
      <NewDirectMessage />
    </NewDirectMessageContext.Provider>,
  )
}

describe('NewDirectMessage', () => {
  it('opens the picker from the trigger', async () => {
    const open = vi.fn()
    const user = userEvent.setup()

    renderWith({ open })
    await user.click(screen.getByRole('button', { name: /new message/i }))

    expect(open).toHaveBeenCalledOnce()
  })

  it('lists people when open and starts a conversation on click', async () => {
    const selectUser = vi.fn()
    const user = userEvent.setup()

    renderWith({
      isOpen: true,
      users: [
        { id: 'user-2', name: 'Alice Levi', avatarInitials: 'AL', avatarUrl: null },
        { id: 'user-3', name: 'Ben Katz',   avatarInitials: 'BK', avatarUrl: null },
      ],
      selectUser,
    })

    expect(screen.getByText('Alice Levi')).toBeInTheDocument()
    await user.click(screen.getByText('Ben Katz'))

    expect(selectUser).toHaveBeenCalledWith('user-3')
  })

  it('shows an empty message when no people match', () => {
    renderWith({ isOpen: true, users: [] })

    expect(screen.getByText(/no people found/i)).toBeInTheDocument()
  })
})
