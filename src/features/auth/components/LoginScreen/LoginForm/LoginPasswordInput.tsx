import type { ChangeEvent }          from 'react'
import { useLoginContext }           from '../LoginScreen.context'
import { LOGIN_PASSWORD_PLACEHOLDER } from '../LoginScreen.constants'
import { LOGIN_INPUT_CLASS }         from './LoginForm.constants'

export function LoginPasswordInput() {
  const { password, setPassword, isLoading } = useLoginContext()

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)

  return (
    <input
      type="password"
      placeholder={LOGIN_PASSWORD_PLACEHOLDER}
      value={password}
      onChange={onChange}
      disabled={isLoading}
      className={LOGIN_INPUT_CLASS}
    />
  )
}
