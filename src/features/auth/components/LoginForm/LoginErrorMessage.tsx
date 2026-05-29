import { LOGIN_ERROR_CLASS } from './LoginForm.constants'

type Props = {
  error: string | null
}

export function LoginErrorMessage({ error }: Props) {
  if (!error) return null
  return <p className={LOGIN_ERROR_CLASS}>{error}</p>
}
