import { useSignupContext }    from '../SignupScreen.context'
import { SignupNameInput }     from './SignupNameInput'
import { SignupEmailInput }    from './SignupEmailInput'
import { SignupPasswordInput } from './SignupPasswordInput'
import { SignupErrorMessage } from './SignupErrorMessage'
import { SignupSubmitButton } from './SignupSubmitButton'
import { SignupSwitchLink }   from './SignupSwitchLink'
import { SIGNUP_FORM_CLASS }  from './SignupForm.constants'

export function SignupForm() {
  const { handleSubmit } = useSignupContext()

  return (
    <form onSubmit={handleSubmit} className={SIGNUP_FORM_CLASS}>
      <SignupNameInput />
      <SignupEmailInput />
      <SignupPasswordInput />
      <SignupErrorMessage />
      <SignupSubmitButton />
      <SignupSwitchLink />
    </form>
  )
}
