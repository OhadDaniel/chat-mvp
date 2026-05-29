import { LoginCard }           from '@/features/auth/components/LoginCard/LoginCard'
import { LoginFormContainer }  from '@/features/auth/components/LoginForm/LoginFormContainer'
import { LOGIN_SCREEN_CLASS }  from './LoginScreen.constants'

export function LoginScreen() {
  return (
    <div className={LOGIN_SCREEN_CLASS}>
      <LoginCard>
        <LoginFormContainer />
      </LoginCard>
    </div>
  )
}
