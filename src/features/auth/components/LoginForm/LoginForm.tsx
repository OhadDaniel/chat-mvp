import { useLoginContext }    from '@/features/auth/components/LoginScreen/LoginScreen.context'
import { LoginNameInput }    from './LoginNameInput'
import { LoginPasswordInput } from './LoginPasswordInput'
import { LoginErrorMessage } from './LoginErrorMessage'
import { LoginSubmitButton } from './LoginSubmitButton'
import { LOGIN_FORM_CLASS }  from './LoginForm.constants'

export function LoginForm() {
  const { handleSubmit } = useLoginContext()

  return (
    <form onSubmit={handleSubmit} className={LOGIN_FORM_CLASS}>
      <LoginNameInput />
      <LoginPasswordInput />
      <LoginErrorMessage />
      <LoginSubmitButton />
    </form>
  )
}
