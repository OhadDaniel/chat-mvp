import type { ChangeEvent }          from 'react'
import { useSignupContext }          from '../SignupScreen.context'
import { SIGNUP_NAME_PLACEHOLDER }   from '../SignupScreen.constants'
import { SIGNUP_INPUT_CLASS }        from './SignupForm.constants'

export function SignupNameInput() {
  const { name, setName, isLoading } = useSignupContext()

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setName(e.target.value)

  return (
    <input
      type="text"
      placeholder={SIGNUP_NAME_PLACEHOLDER}
      value={name}
      onChange={onChange}
      disabled={isLoading}
      className={SIGNUP_INPUT_CLASS}
    />
  )
}
