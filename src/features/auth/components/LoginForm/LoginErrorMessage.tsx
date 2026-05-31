import { useLoginContext } from '@/features/auth/components/LoginScreen/LoginScreen.context'
import { LOGIN_ERROR_CLASS } from './LoginForm.constants'

export function LoginErrorMessage() {
  const { error } = useLoginContext()

  if (!error) return null
  return <p className={LOGIN_ERROR_CLASS}>{error}</p>
}
