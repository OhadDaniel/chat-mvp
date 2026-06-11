import { LoginCard }          from './LoginCard/LoginCard'
import { LoginForm }          from './LoginForm/LoginForm'
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
