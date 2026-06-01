import { useLoginContext }                           from '@/features/auth/components/LoginScreen/LoginScreen.context'
import { LOGIN_SUBMIT_LABEL, LOGIN_LOADING_LABEL }   from '@/features/auth/components/LoginScreen/LoginScreen.constants'
import { LOGIN_BUTTON_CLASS }                        from './LoginForm.constants'

export function LoginSubmitButton() {
  const { isLoading } = useLoginContext()

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={LOGIN_BUTTON_CLASS}
    >
      {isLoading ? LOGIN_LOADING_LABEL : LOGIN_SUBMIT_LABEL}
    </button>
  )
}
