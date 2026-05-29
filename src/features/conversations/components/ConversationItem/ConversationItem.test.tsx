import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { ConversationItem }          from './ConversationItem'

const defaultProps = {
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

describe('ConversationItem', () => {
  it('renders the name and last message', () => {
    render(<ul><ConversationItem {...defaultProps} /></ul>)

    expect(screen.getByText('Alice Levi')).toBeInTheDocument()
    expect(screen.getByText('sounds good!')).toBeInTheDocument()
  })

  it('renders the unread badge when unreadCount > 0', () => {
    render(<ul><ConversationItem {...defaultProps} unreadCount={3} /></ul>)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not render the unread badge when unreadCount is 0', () => {
    render(<ul><ConversationItem {...defaultProps} unreadCount={0} /></ul>)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    const user     = userEvent.setup()

    render(<ul><ConversationItem {...defaultProps} onSelect={onSelect} /></ul>)
    await user.click(screen.getByText('Alice Levi'))

    expect(onSelect).toHaveBeenCalledOnce()
  })
})
