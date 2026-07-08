import { describe, it, expect, vi }      from 'vitest'
import { render, screen }                 from '@testing-library/react'
import userEvent                          from '@testing-library/user-event'
import { NewGroup }                       from './NewGroup'
import { NewGroupContext }                from './NewGroup.context'
import type { NewGroupContextValue }      from './NewGroup.types'

const baseValue: NewGroupContextValue = {
  isOpen:     false,
  open:       vi.fn(),
  close:      vi.fn(),
  name:       '',
  setName:    vi.fn(),
  users:      [],
  search:     '',
  setSearch:  vi.fn(),
  isSelected: () => false,
  toggle:     vi.fn(),
  canCreate:  false,
  busy:       false,
  create:     vi.fn(),
}

function renderWith(overrides: Partial<NewGroupContextValue> = {}) {
  return render(
    <NewGroupContext.Provider value={{ ...baseValue, ...overrides }}>
      <NewGroup />
    </NewGroupContext.Provider>,
  )
}

describe('NewGroup', () => {
  it('opens from the trigger', async () => {
    const open = vi.fn()
    const user = userEvent.setup()

    renderWith({ open })
    await user.click(screen.getByRole('button', { name: /new group/i }))

    expect(open).toHaveBeenCalledOnce()
  })

  it('toggles a person when picking members', async () => {
    const toggle = vi.fn()
    const user = userEvent.setup()

    renderWith({
      isOpen: true,
      users: [
        { id: 'user-2', name: 'Alice Levi', avatarInitials: 'AL', avatarUrl: null },
      ],
      toggle,
    })
    await user.click(screen.getByText('Alice Levi'))

    expect(toggle).toHaveBeenCalledWith('user-2')
  })

  it('creates when allowed, and is disabled without a title', async () => {
    const create = vi.fn()
    const user = userEvent.setup()

    const { rerender } = renderWith({ isOpen: true, canCreate: false, create })
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()

    rerender(
      <NewGroupContext.Provider value={{ ...baseValue, isOpen: true, canCreate: true, create }}>
        <NewGroup />
      </NewGroupContext.Provider>,
    )
    await user.click(screen.getByRole('button', { name: /create/i }))
    expect(create).toHaveBeenCalledOnce()
  })
})
