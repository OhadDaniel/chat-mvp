import { LoginCard }          from '@/features/auth/components/LoginCard/LoginCard'
import { LoginForm }          from '@/features/auth/components/LoginForm/LoginForm'
import { LOGIN_SCREEN_CLASS } from './LoginScreen.constants'

export function LoginScreen() {
  return (
    <div className={LOGIN_SCREEN_CLASS}>
      <LoginCard>
        <LoginForm />
      </LoginCard>
    </div>
  )
}
