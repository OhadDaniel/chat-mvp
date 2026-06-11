import { useSignupContext }                          from '../SignupScreen.context'
import { SIGNUP_SUBMIT_LABEL, SIGNUP_LOADING_LABEL } from '../SignupScreen.constants'
import { SIGNUP_BUTTON_CLASS }                       from './SignupForm.constants'

export function SignupSubmitButton() {
  const { isLoading } = useSignupContext()

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={SIGNUP_BUTTON_CLASS}
    >
      {isLoading ? SIGNUP_LOADING_LABEL : SIGNUP_SUBMIT_LABEL}
    </button>
  )
}
