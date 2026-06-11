import { SignupCard }          from './SignupCard/SignupCard'
import { SignupForm }          from './SignupForm/SignupForm'
import { SIGNUP_SCREEN_CLASS } from './SignupScreen.constants'

export function SignupScreen() {
  return (
    <div className={SIGNUP_SCREEN_CLASS}>
      <SignupCard>
        <SignupForm />
      </SignupCard>
    </div>
  )
}
