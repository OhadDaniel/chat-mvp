import { LoginCard }          from './components/LoginCard/LoginCard'
import { LoginForm }          from './components/LoginCard/components/LoginForm/LoginForm'
import { LOGIN_SCREEN_CLASS } from './constants/LoginScreen.constants'

export function LoginScreen() {
  return (
    <div className={LOGIN_SCREEN_CLASS}>
      <LoginCard>
        <LoginForm />
      </LoginCard>
    </div>
  )
}
