import { describe, it, expect } from 'vitest'
import { render, screen }        from '@testing-library/react'
import { UserAvatar }            from './UserAvatar'

describe('UserAvatar', () => {
  it('renders an image with the given src and alt when avatarUrl is set', () => {
    render(<UserAvatar initials="AL" name="Alice Levi" avatarUrl="https://cdn.dev/a.png" />)

    const img = screen.getByRole('img', { name: 'Alice Levi' })
    expect(img).toHaveAttribute('src', 'https://cdn.dev/a.png')
    expect(img).toHaveAttribute('alt', 'Alice Levi')
  })

  it('renders the initials when avatarUrl is null', () => {
    const { container } = render(<UserAvatar initials="AL" name="Alice Levi" avatarUrl={null} />)

    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })
})
