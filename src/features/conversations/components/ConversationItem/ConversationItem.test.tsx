import { describe, it, expect, vi }     from 'vitest'
import { render, screen }                from '@testing-library/react'
import userEvent                         from '@testing-library/user-event'
import { ConversationItem }              from './ConversationItem'
import { ConversationItemContext }       from './ConversationItem.context'
import type { ConversationItemContextValue } from './ConversationItem.context'

const defaultContext: ConversationItemContextValue = {
  initials:    'AL',
  name:        'Alice Levi',
  lastMessage: 'sounds good!',
  time:        '2m',
  unreadCount: 0,
  isPinned:    false,
  isSelected:  false,
  onTogglePin: vi.fn(),
  onSelect:    vi.fn(),
}

function renderWithContext(overrides: Partial<ConversationItemContextValue> = {}) {
  const value = { ...defaultContext, ...overrides }
  return render(
    <ConversationItemContext.Provider value={value}>
      <ul><ConversationItem /></ul>
    </ConversationItemContext.Provider>
  )
}

describe('ConversationItem', () => {
  it('renders the name and last message', () => {
    renderWithContext()

    expect(screen.getByText('Alice Levi')).toBeInTheDocument()
    expect(screen.getByText('sounds good!')).toBeInTheDocument()
  })

  it('renders the unread badge when unreadCount > 0', () => {
    renderWithContext({ unreadCount: 3 })

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not render the unread badge when unreadCount is 0', () => {
    renderWithContext({ unreadCount: 0 })

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    const user     = userEvent.setup()

    renderWithContext({ onSelect })
    await user.click(screen.getByText('Alice Levi'))

    expect(onSelect).toHaveBeenCalledOnce()
  })
})
