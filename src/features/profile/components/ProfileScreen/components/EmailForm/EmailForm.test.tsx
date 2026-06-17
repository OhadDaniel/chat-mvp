import { describe, it, expect, vi } from 'vitest'
import { render, screen }             from '@testing-library/react'
import userEvent                      from '@testing-library/user-event'
import { EmailForm }                  from './EmailForm'
import { EmailFormContext }           from './EmailForm.context'
import type { EmailFormContextValue } from './EmailForm.types'

const defaultValue: EmailFormContextValue = {
  email:    'ada@chat.dev',
  error:    null,
  saving:   false,
  setEmail: vi.fn(),
  onSubmit: vi.fn(),
}

function renderWith(overrides: Partial<EmailFormContextValue> = {}) {
  return render(
    <EmailFormContext.Provider value={{ ...defaultValue, ...overrides }}>
      <EmailForm />
    </EmailFormContext.Provider>,
  )
}

describe('EmailForm', () => {
  it('renders the email input and the save button', () => {
    renderWith()

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save email/i })).toBeInTheDocument()
  })

  it('displays the error message when error is provided', () => {
    renderWith({ error: 'That email is already in use' })

    expect(screen.getByText(/already in use/i)).toBeInTheDocument()
  })

  it('disables the input and button while saving', () => {
    renderWith({ saving: true })

    expect(screen.getByPlaceholderText(/email/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('calls onSubmit when the form is submitted', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    const user     = userEvent.setup()

    renderWith({ onSubmit })
    await user.click(screen.getByRole('button', { name: /save email/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
