import { useAuthScreensContext }     from '@/features/auth/components/AuthScreens/AuthScreens.context'
import {
  SIGNUP_SWITCH_PROMPT,
  SIGNUP_SWITCH_ACTION,
} from '../SignupScreen.constants'
import { SIGNUP_SWITCH_CLASS, SIGNUP_SWITCH_BUTTON_CLASS } from './SignupForm.constants'

export function SignupSwitchLink() {
  const { switchToLogin } = useAuthScreensContext()

  return (
    <p className={SIGNUP_SWITCH_CLASS}>
      {SIGNUP_SWITCH_PROMPT}{' '}
      <button type="button" onClick={switchToLogin} className={SIGNUP_SWITCH_BUTTON_CLASS}>
        {SIGNUP_SWITCH_ACTION}
      </button>
    </p>
  )
}
