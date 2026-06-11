import type { ChangeEvent }          from 'react'
import { useLoginContext }           from '../LoginScreen.context'
import { LOGIN_EMAIL_PLACEHOLDER }   from '../LoginScreen.constants'
import { LOGIN_INPUT_CLASS }         from './LoginForm.constants'

export function LoginEmailInput() {
  const { email, setEmail, isLoading } = useLoginContext()

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)

  return (
    <input
      type="email"
      placeholder={LOGIN_EMAIL_PLACEHOLDER}
      value={email}
      onChange={onChange}
      disabled={isLoading}
      className={LOGIN_INPUT_CLASS}
    />
  )
}
