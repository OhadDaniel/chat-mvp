import type { ChangeEvent }          from 'react'
import { useSignupContext }          from '../SignupScreen.context'
import { SIGNUP_EMAIL_PLACEHOLDER }  from '../SignupScreen.constants'
import { SIGNUP_INPUT_CLASS }        from './SignupForm.constants'

export function SignupEmailInput() {
  const { email, setEmail, isLoading } = useSignupContext()

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)

  return (
    <input
      type="email"
      placeholder={SIGNUP_EMAIL_PLACEHOLDER}
      value={email}
      onChange={onChange}
      disabled={isLoading}
      className={SIGNUP_INPUT_CLASS}
    />
  )
}
