import { describe, it, expect, vi }  from 'vitest'
import { render, screen }             from '@testing-library/react'
import userEvent                      from '@testing-library/user-event'
import { LoginForm }                  from './LoginForm'
import { LoginContext }               from '../LoginScreen.context'
import { AuthScreensContext }         from '@/features/auth/components/AuthScreens/AuthScreens.context'
import type { LoginContextValue }     from '../LoginScreen.types'
import type { AuthScreensContextValue } from '@/features/auth/components/AuthScreens/AuthScreens.types'
const defaultLoginContext: LoginContextValue = {
  email:        '',
  password:     '',
  error:        null,
  isLoading:    false,
  setEmail:     vi.fn(),
  setPassword:  vi.fn(),
  handleSubmit: vi.fn(),
}

const defaultAuthScreensContext: AuthScreensContextValue = {
  mode:           'login',
  switchToLogin:  vi.fn(),
  switchToSignup: vi.fn(),
}

function renderWithContext(overrides: Partial<LoginContextValue> = {}) {
  const loginValue = { ...defaultLoginContext, ...overrides }
  return render(
    <AuthScreensContext.Provider value={defaultAuthScreensContext}>
      <LoginContext.Provider value={loginValue}>
        <LoginForm />
      </LoginContext.Provider>
    </AuthScreensContext.Provider>,
  )
}

describe('LoginForm', () => {
  it('renders email input, password input and submit button', () => {
    renderWithContext()

    expect(screen.getByPlaceholderText(/ohad@chat\.dev/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays the error message when error is provided', () => {
    renderWithContext({ error: 'Invalid email or password' })

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
  })

  it('disables inputs and button while loading', () => {
    renderWithContext({ isLoading: true })

    expect(screen.getByPlaceholderText(/ohad@chat\.dev/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/password/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('calls handleSubmit when form is submitted', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())
    const user         = userEvent.setup()

    renderWithContext({ handleSubmit })
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(handleSubmit).toHaveBeenCalledOnce()
  })
})
