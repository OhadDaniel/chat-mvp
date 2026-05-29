import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { LoginForm }                 from './LoginForm'

const defaultProps = {
  name:             '',
  password:         '',
  error:            null,
  isLoading:        false,
  onNameChange:     vi.fn(),
  onPasswordChange: vi.fn(),
  onSubmit:         vi.fn(),
}

describe('LoginForm', () => {
  it('renders name input, password input and submit button', () => {
    render(<LoginForm {...defaultProps} />)

    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays the error message when error is provided', () => {
    render(<LoginForm {...defaultProps} error="No account found with that name" />)

    expect(screen.getByText(/no account found/i)).toBeInTheDocument()
  })

  it('disables inputs and button while loading', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />)

    expect(screen.getByPlaceholderText(/your name/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/password/i)).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    const user     = userEvent.setup()

    render(<LoginForm {...defaultProps} onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
