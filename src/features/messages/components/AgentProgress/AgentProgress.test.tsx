import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgentProgressContainer } from './AgentProgressContainer'

describe('AgentProgressContainer', () => {
  it('shows the document-search label while retrieval runs', () => {
    render(<AgentProgressContainer toolActivity={{ name: 'retrieve_docs' }} />)
    expect(screen.getByText('Searching your documents…')).toBeInTheDocument()
  })

  it('shows the messages label while the user-data tool runs', () => {
    render(
      <AgentProgressContainer
        toolActivity={{ name: 'summarize_my_recent_messages' }}
      />,
    )
    expect(screen.getByText('Looking up your messages…')).toBeInTheDocument()
  })

  it('falls back to a generic label for an unknown tool', () => {
    render(<AgentProgressContainer toolActivity={{ name: 'mystery_tool' }} />)
    expect(screen.getByText('Working…')).toBeInTheDocument()
  })

  it('renders nothing when no tool is active', () => {
    const { container } = render(<AgentProgressContainer toolActivity={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
