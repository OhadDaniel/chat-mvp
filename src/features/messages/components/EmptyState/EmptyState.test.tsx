import { describe, it, expect } from 'vitest'
import { render, screen }       from '@testing-library/react'
import { NoMessages }               from './NoMessages/NoMessages'
import { NoConversationSelected }   from './NoConversationSelected/NoConversationSelected'

describe('EmptyState components', () => {
  it('NoMessages renders the correct message', () => {
    render(<NoMessages />)
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument()
  })

  it('NoConversationSelected renders the correct message', () => {
    render(<NoConversationSelected />)
    expect(screen.getByText(/select a conversation/i)).toBeInTheDocument()
  })
})
