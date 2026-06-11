import { useAuthScreensContext }     from '@/features/auth/components/AuthScreens/AuthScreens.context'
import {
  LOGIN_SWITCH_PROMPT,
  LOGIN_SWITCH_ACTION,
} from '../LoginScreen.constants'
import { LOGIN_SWITCH_CLASS, LOGIN_SWITCH_BUTTON_CLASS } from './LoginForm.constants'

export function LoginSwitchLink() {
  const { switchToSignup } = useAuthScreensContext()

  return (
    <p className={LOGIN_SWITCH_CLASS}>
      {LOGIN_SWITCH_PROMPT}{' '}
      <button type="button" onClick={switchToSignup} className={LOGIN_SWITCH_BUTTON_CLASS}>
        {LOGIN_SWITCH_ACTION}
      </button>
    </p>
  )
}
