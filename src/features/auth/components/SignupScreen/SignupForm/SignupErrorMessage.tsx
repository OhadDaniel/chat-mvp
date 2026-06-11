import { useSignupContext } from '../SignupScreen.context'
import { SIGNUP_ERROR_CLASS } from './SignupForm.constants'

export function SignupErrorMessage() {
  const { error } = useSignupContext()

  if (!error) return null
  return <p className={SIGNUP_ERROR_CLASS}>{error}</p>
}
