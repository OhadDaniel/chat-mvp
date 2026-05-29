import { LOGIN_SUBMIT_LABEL, LOGIN_LOADING_LABEL } from '@/features/auth/components/LoginScreen/LoginScreen.constants'
import { LOGIN_BUTTON_CLASS }                       from './LoginForm.constants'

type Props = {
  isLoading: boolean
}

export function LoginSubmitButton({ isLoading }: Props) {
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
