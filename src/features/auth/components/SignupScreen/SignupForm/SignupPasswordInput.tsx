import type { ChangeEvent }            from 'react'
import { useSignupContext }            from '../SignupScreen.context'
import { SIGNUP_PASSWORD_PLACEHOLDER } from '../SignupScreen.constants'
import { SIGNUP_INPUT_CLASS }          from './SignupForm.constants'

export function SignupPasswordInput() {
  const { password, setPassword, isLoading } = useSignupContext()

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)

  return (
    <input
      type="password"
      placeholder={SIGNUP_PASSWORD_PLACEHOLDER}
      value={password}
      onChange={onChange}
      disabled={isLoading}
      className={SIGNUP_INPUT_CLASS}
    />
  )
}
