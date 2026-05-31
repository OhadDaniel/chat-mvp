import { describe, it, expect, vi }  from 'vitest'
import { render, screen }             from '@testing-library/react'
import userEvent                      from '@testing-library/user-event'
import { LoginForm }                  from './LoginForm'
import { LoginContext }               from '@/features/auth/components/LoginScreen/LoginScreen.context'
import type { LoginContextValue }     from '@/features/auth/components/LoginScreen/LoginScreen.types'

const defaultContext: LoginContextValue = {
  name:         '',
  password:     '',
  error:        null,
  isLoading:    false,
  setName:      vi.fn(),
  setPassword:  vi.fn(),
  handleSubmit: vi.fn(),
}

function renderWithContext(overrides: Partial<LoginContextValue> = {}) {
  const value = { ...defaultContext, ...overrides }
  return render(
    <LoginContext.Provider value={value}>
      <LoginForm />
    </LoginContext.Provider>
  )
}

describe('LoginForm', () => {
  it('renders name input, password input and submit button', () => {
    renderWithContext()

    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays the error message when error is provided', () => {
    renderWithContext({ error: 'No account found with that name' })

    expect(screen.getByText(/no account found/i)).toBeInTheDocument()
  })

  it('disables inputs and button while loading', () => {
    renderWithContext({ isLoading: true })

    expect(screen.getByPlaceholderText(/your name/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/password/i)).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls handleSubmit when form is submitted', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())
    const user         = userEvent.setup()

    renderWithContext({ handleSubmit })
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(handleSubmit).toHaveBeenCalledOnce()
  })
})
