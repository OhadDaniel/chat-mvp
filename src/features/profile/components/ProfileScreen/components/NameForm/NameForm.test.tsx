import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { NameForm }                  from './NameForm'
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
      <NameForm />
    </ProfileContext.Provider>,
  )
}

describe('NameForm', () => {
  it('renders the first name, last name inputs and the save button', () => {
    renderWithContext()

    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save name/i })).toBeInTheDocument()
  })

  it('displays the error message when nameError is provided', () => {
    renderWithContext({ nameError: 'Could not update your name — please try again' })

    expect(screen.getByText(/could not update your name/i)).toBeInTheDocument()
  })

  it('disables inputs and button while nameSaving', () => {
    renderWithContext({ nameSaving: true })

    expect(screen.getByPlaceholderText(/first name/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/last name/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('calls onSubmitName when the form is submitted', async () => {
    const onSubmitName = vi.fn((e) => e.preventDefault())
    const user         = userEvent.setup()

    renderWithContext({ onSubmitName })
    await user.click(screen.getByRole('button', { name: /save name/i }))

    expect(onSubmitName).toHaveBeenCalledOnce()
  })
})
