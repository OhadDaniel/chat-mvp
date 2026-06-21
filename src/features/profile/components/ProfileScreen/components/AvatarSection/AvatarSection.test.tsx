import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { AvatarSection }             from './AvatarSection'
import { AvatarContext }             from './AvatarSection.context'
import type { AvatarContextValue }   from './AvatarSection.types'

const defaultValue: AvatarContextValue = {
  avatarUrl:      null,
  avatarInitials: 'AL',
  avatarName:     'Ada Lovelace',
  hasAvatar:      false,
  busy:           false,
  fileInputRef:   { current: null },
  openFilePicker: vi.fn(),
  onFileChange:   vi.fn(),
  onRemove:       vi.fn(),
}

function renderWith(overrides: Partial<AvatarContextValue> = {}) {
  return render(
    <AvatarContext.Provider value={{ ...defaultValue, ...overrides }}>
      <AvatarSection />
    </AvatarContext.Provider>,
  )
}

describe('AvatarSection', () => {
  it('renders the upload button', () => {
    renderWith()

    expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument()
  })

  it('does not render the remove button when there is no avatar', () => {
    renderWith({ hasAvatar: false })

    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('renders the remove button when there is an avatar', () => {
    renderWith({ hasAvatar: true })

    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('calls openFilePicker when the upload button is clicked', async () => {
    const openFilePicker = vi.fn()
    const user           = userEvent.setup()

    renderWith({ openFilePicker })
    await user.click(screen.getByRole('button', { name: /upload photo/i }))

    expect(openFilePicker).toHaveBeenCalledOnce()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const onRemove = vi.fn()
    const user     = userEvent.setup()

    renderWith({ hasAvatar: true, onRemove })
    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('disables the action buttons while busy', () => {
    renderWith({ hasAvatar: true, busy: true })

    expect(screen.getByRole('button', { name: /upload photo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
  })
})
