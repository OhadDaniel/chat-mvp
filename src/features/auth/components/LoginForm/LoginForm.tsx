import type { LoginFormProps }   from './LoginForm.types'
import { LoginNameInput }        from './LoginNameInput'
import { LoginPasswordInput }    from './LoginPasswordInput'
import { LoginErrorMessage }     from './LoginErrorMessage'
import { LoginSubmitButton }     from './LoginSubmitButton'
import { LOGIN_FORM_CLASS }      from './LoginForm.constants'

export function LoginForm({ name, password, error, isLoading, onNameChange, onPasswordChange, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className={LOGIN_FORM_CLASS}>
      <LoginNameInput     value={name}     onChange={onNameChange}     disabled={isLoading} />
      <LoginPasswordInput value={password} onChange={onPasswordChange} disabled={isLoading} />
      <LoginErrorMessage  error={error} />
      <LoginSubmitButton  isLoading={isLoading} />
    </form>
  )
}
