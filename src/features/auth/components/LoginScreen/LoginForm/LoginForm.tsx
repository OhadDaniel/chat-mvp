import { useLoginContext }    from '../LoginScreen.context'
import { LoginEmailInput }    from './LoginEmailInput'
import { LoginPasswordInput } from './LoginPasswordInput'
import { LoginErrorMessage } from './LoginErrorMessage'
import { LoginSubmitButton } from './LoginSubmitButton'
import { LoginSwitchLink }   from './LoginSwitchLink'
import { LOGIN_FORM_CLASS }  from './LoginForm.constants'

export function LoginForm() {
  const { handleSubmit } = useLoginContext()

  return (
    <form onSubmit={handleSubmit} className={LOGIN_FORM_CLASS}>
      <LoginEmailInput />
      <LoginPasswordInput />
      <LoginErrorMessage />
      <LoginSubmitButton />
      <LoginSwitchLink />
    </form>
  )
}
