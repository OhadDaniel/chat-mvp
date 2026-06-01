import { useLoginContext }         from '../../../../context/LoginScreen.context'
import { LOGIN_NAME_PLACEHOLDER }  from '../../../../constants/LoginScreen.constants'
import { LOGIN_INPUT_CLASS }       from './constants/LoginForm.constants'

export function LoginNameInput() {
  const { name, onNameChange, isLoading } = useLoginContext()

  return (
    <input
      type="text"
      placeholder={LOGIN_NAME_PLACEHOLDER}
      value={name}
      onChange={onNameChange}
      disabled={isLoading}
      className={LOGIN_INPUT_CLASS}
    />
  )
}
