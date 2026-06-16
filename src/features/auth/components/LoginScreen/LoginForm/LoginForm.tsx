import { useLoginContext }        from '../LoginScreen.context'
import { useAuthScreensContext }  from '@/features/auth/components/AuthScreens/AuthScreens.context'
import { TextInput }              from '@/shared/components/TextInput'
import { FormError }              from '@/shared/components/FormError'
import { SubmitButton }           from '@/shared/components/SubmitButton'
import { AuthSwitchLink }         from '@/features/auth/components/shared/AuthSwitchLink'
import {
  LOGIN_EMAIL_PLACEHOLDER,
  LOGIN_PASSWORD_PLACEHOLDER,
  LOGIN_SUBMIT_LABEL,
  LOGIN_LOADING_LABEL,
  LOGIN_SWITCH_PROMPT,
  LOGIN_SWITCH_ACTION,
} from '../LoginScreen.constants'
import {
  LOGIN_FORM_CLASS,
  LOGIN_INPUT_CLASS,
  LOGIN_BUTTON_CLASS,
  LOGIN_ERROR_CLASS,
  LOGIN_SWITCH_CLASS,
  LOGIN_SWITCH_BUTTON_CLASS,
} from './LoginForm.constants'

export function LoginForm() {
  const { email, password, error, isLoading, setEmail, setPassword, handleSubmit } = useLoginContext()
  const { switchToSignup } = useAuthScreensContext()

  return (
    <form onSubmit={handleSubmit} className={LOGIN_FORM_CLASS}>
      <TextInput
        type="email"
        placeholder={LOGIN_EMAIL_PLACEHOLDER}
        value={email}
        onChange={setEmail}
        disabled={isLoading}
        className={LOGIN_INPUT_CLASS}
      />
      <TextInput
        type="password"
        placeholder={LOGIN_PASSWORD_PLACEHOLDER}
        value={password}
        onChange={setPassword}
        disabled={isLoading}
        className={LOGIN_INPUT_CLASS}
      />
      <FormError error={error} className={LOGIN_ERROR_CLASS} />
      <SubmitButton
        label={LOGIN_SUBMIT_LABEL}
        loadingLabel={LOGIN_LOADING_LABEL}
        isLoading={isLoading}
        className={LOGIN_BUTTON_CLASS}
      />
      <AuthSwitchLink
        prompt={LOGIN_SWITCH_PROMPT}
        action={LOGIN_SWITCH_ACTION}
        onSwitch={switchToSignup}
        className={LOGIN_SWITCH_CLASS}
        buttonClassName={LOGIN_SWITCH_BUTTON_CLASS}
      />
    </form>
  )
}
