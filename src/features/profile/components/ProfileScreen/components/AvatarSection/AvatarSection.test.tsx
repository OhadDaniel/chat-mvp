import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { AvatarSection }             from './AvatarSection'
import { ProfileContext }            from '../../ProfileScreen.context'
import type { ProfileContextValue }  from '../../ProfileScreen.types'

const defaultProfileContext: ProfileContextValue = {
  firstName:      'Ada',
  lastName:       'Lovelace',
  nameError:      null,
  nameSaving:     false,
  setFirstName:   vi.fn(),
  setLastName:    vi.fn(),
  onSubmitName:   vi.fn(),
  email:          'ada@chat.dev',
  emailError:     null,
  emailSaving:    false,
  setEmail:       vi.fn(),
  onSubmitEmail:  vi.fn(),
  avatarUrl:      null,
  avatarInitials: 'AL',
  avatarName:     'Ada Lovelace',
  hasAvatar:      false,
  avatarBusy:     false,
  fileInputRef:   { current: null },
  openFilePicker: vi.fn(),
  onAvatarChange: vi.fn(),
  onRemoveAvatar: vi.fn(),
}

function renderWithContext(overrides: Partial<ProfileContextValue> = {}) {
  const value = { ...defaultProfileContext, ...overrides }
  return render(
    <ProfileContext.Provider value={value}>
      <AvatarSection />
    </ProfileContext.Provider>,
  )
}

describe('AvatarSection', () => {
  it('renders the upload button', () => {
    renderWithContext()

    expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument()
  })

  it('does not render the remove button when there is no avatar', () => {
    renderWithContext({ hasAvatar: false })

    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('renders the remove button when there is an avatar', () => {
    renderWithContext({ hasAvatar: true })

    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('calls openFilePicker when the upload button is clicked', async () => {
    const openFilePicker = vi.fn()
    const user           = userEvent.setup()

    renderWithContext({ openFilePicker })
    await user.click(screen.getByRole('button', { name: /upload photo/i }))

    expect(openFilePicker).toHaveBeenCalledOnce()
  })

  it('calls onRemoveAvatar when the remove button is clicked', async () => {
    const onRemoveAvatar = vi.fn()
    const user           = userEvent.setup()

    renderWithContext({ hasAvatar: true, onRemoveAvatar })
    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(onRemoveAvatar).toHaveBeenCalledOnce()
  })

  it('disables the action buttons while avatarBusy', () => {
    renderWithContext({ hasAvatar: true, avatarBusy: true })

    expect(screen.getByRole('button', { name: /upload photo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
  })
})
