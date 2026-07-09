import { useLoginContext }             from '../../../../context/LoginScreen.context'
import { LOGIN_PASSWORD_PLACEHOLDER }  from '../../../../constants/LoginScreen.constants'
import { LOGIN_INPUT_CLASS }           from './constants/LoginForm.constants'

export function LoginPasswordInput() {
  const { password, onPasswordChange, isLoading } = useLoginContext()

  return (
    <input
      type="password"
      placeholder={LOGIN_PASSWORD_PLACEHOLDER}
      value={password}
      onChange={onPasswordChange}
      disabled={isLoading}
      className={LOGIN_INPUT_CLASS}
    />
  )
}
