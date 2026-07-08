import { describe, it, expect } from 'vitest'
import { render, screen }       from '@testing-library/react'
import { GroupAvatar }          from './GroupAvatar'

describe('GroupAvatar', () => {
  it('renders the group photo when avatarUrl is set', () => {
    render(<GroupAvatar name="Fellowship Crew" avatarUrl="https://cdn.test/avatar.png" />)

    const image = screen.getByRole('img', { name: 'Fellowship Crew' })
    expect(image).toHaveAttribute('src', 'https://cdn.test/avatar.png')
  })

  it('renders the people glyph when there is no photo', () => {
    render(<GroupAvatar name="Fellowship Crew" avatarUrl={null} />)

    const placeholder = screen.getByRole('img', { name: 'Fellowship Crew' })
    expect(placeholder.querySelector('svg')).toBeInTheDocument()
  })
})
