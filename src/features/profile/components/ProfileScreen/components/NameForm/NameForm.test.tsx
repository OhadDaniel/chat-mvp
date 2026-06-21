import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { NameForm }                  from './NameForm'
import { NameFormContext }           from './NameForm.context'
import type { NameFormContextValue } from './NameForm.types'

const defaultValue: NameFormContextValue = {
  firstName:    'Ada',
  lastName:     'Lovelace',
  error:        null,
  saving:       false,
  setFirstName: vi.fn(),
  setLastName:  vi.fn(),
  onSubmit:     vi.fn(),
}

function renderWith(overrides: Partial<NameFormContextValue> = {}) {
  return render(
    <NameFormContext.Provider value={{ ...defaultValue, ...overrides }}>
      <NameForm />
    </NameFormContext.Provider>,
  )
}

describe('NameForm', () => {
  it('renders the first name, last name inputs and the save button', () => {
    renderWith()

    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save name/i })).toBeInTheDocument()
  })

  it('displays the error message when error is provided', () => {
    renderWith({ error: 'Could not update your name — please try again' })

    expect(screen.getByText(/could not update your name/i)).toBeInTheDocument()
  })

  it('disables inputs and button while saving', () => {
    renderWith({ saving: true })

    expect(screen.getByPlaceholderText(/first name/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/last name/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('calls onSubmit when the form is submitted', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    const user     = userEvent.setup()

    renderWith({ onSubmit })
    await user.click(screen.getByRole('button', { name: /save name/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
