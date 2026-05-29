import { useLoginForm } from './hooks/useLoginForm'
import { LoginForm }    from './LoginForm'

export function LoginFormContainer() {
  const form = useLoginForm()
  return <LoginForm {...form} />
}
