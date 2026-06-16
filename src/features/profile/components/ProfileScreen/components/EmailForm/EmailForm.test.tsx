import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { EmailForm }                 from './EmailForm'
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
      <EmailForm />
    </ProfileContext.Provider>,
  )
}

describe('EmailForm', () => {
  it('renders the email input and the save button', () => {
    renderWithContext()

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save email/i })).toBeInTheDocument()
  })

  it('displays the error message when emailError is provided', () => {
    renderWithContext({ emailError: 'That email is already in use' })

    expect(screen.getByText(/already in use/i)).toBeInTheDocument()
  })

  it('disables the input and button while emailSaving', () => {
    renderWithContext({ emailSaving: true })

    expect(screen.getByPlaceholderText(/email/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('calls onSubmitEmail when the form is submitted', async () => {
    const onSubmitEmail = vi.fn((e) => e.preventDefault())
    const user          = userEvent.setup()

    renderWithContext({ onSubmitEmail })
    await user.click(screen.getByRole('button', { name: /save email/i }))

    expect(onSubmitEmail).toHaveBeenCalledOnce()
  })
})
