import { useSignupContext }       from '../SignupScreen.context'
import { useAuthScreensContext }  from '@/features/auth/components/AuthScreens/AuthScreens.context'
import { AuthInput }              from '@/features/auth/components/shared/AuthInput'
import { AuthErrorMessage }       from '@/features/auth/components/shared/AuthErrorMessage'
import { AuthSubmitButton }       from '@/features/auth/components/shared/AuthSubmitButton'
import { AuthSwitchLink }         from '@/features/auth/components/shared/AuthSwitchLink'
import {
  SIGNUP_NAME_PLACEHOLDER,
  SIGNUP_EMAIL_PLACEHOLDER,
  SIGNUP_PASSWORD_PLACEHOLDER,
  SIGNUP_SUBMIT_LABEL,
  SIGNUP_LOADING_LABEL,
  SIGNUP_SWITCH_PROMPT,
  SIGNUP_SWITCH_ACTION,
} from '../SignupScreen.constants'
import {
  SIGNUP_FORM_CLASS,
  SIGNUP_INPUT_CLASS,
  SIGNUP_BUTTON_CLASS,
  SIGNUP_ERROR_CLASS,
  SIGNUP_SWITCH_CLASS,
  SIGNUP_SWITCH_BUTTON_CLASS,
} from './SignupForm.constants'

export function SignupForm() {
  const { name, email, password, error, isLoading, setName, setEmail, setPassword, handleSubmit } =
    useSignupContext()
  const { switchToLogin } = useAuthScreensContext()

  return (
    <form onSubmit={handleSubmit} className={SIGNUP_FORM_CLASS}>
      <AuthInput
        type="text"
        placeholder={SIGNUP_NAME_PLACEHOLDER}
        value={name}
        onChange={setName}
        disabled={isLoading}
        className={SIGNUP_INPUT_CLASS}
      />
      <AuthInput
        type="email"
        placeholder={SIGNUP_EMAIL_PLACEHOLDER}
        value={email}
        onChange={setEmail}
        disabled={isLoading}
        className={SIGNUP_INPUT_CLASS}
      />
      <AuthInput
        type="password"
        placeholder={SIGNUP_PASSWORD_PLACEHOLDER}
        value={password}
        onChange={setPassword}
        disabled={isLoading}
        className={SIGNUP_INPUT_CLASS}
      />
      <AuthErrorMessage error={error} className={SIGNUP_ERROR_CLASS} />
      <AuthSubmitButton
        label={SIGNUP_SUBMIT_LABEL}
        loadingLabel={SIGNUP_LOADING_LABEL}
        isLoading={isLoading}
        className={SIGNUP_BUTTON_CLASS}
      />
      <AuthSwitchLink
        prompt={SIGNUP_SWITCH_PROMPT}
        action={SIGNUP_SWITCH_ACTION}
        onSwitch={switchToLogin}
        className={SIGNUP_SWITCH_CLASS}
        buttonClassName={SIGNUP_SWITCH_BUTTON_CLASS}
      />
    </form>
  )
}
