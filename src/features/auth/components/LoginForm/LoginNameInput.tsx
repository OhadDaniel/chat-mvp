import type { ChangeEvent }          from 'react'
import { useLoginContext }           from '@/features/auth/components/LoginScreen/LoginScreen.context'
import { LOGIN_NAME_PLACEHOLDER }    from '@/features/auth/components/LoginScreen/LoginScreen.constants'
import { LOGIN_INPUT_CLASS }         from './LoginForm.constants'

export function LoginNameInput() {
  const { name, setName, isLoading } = useLoginContext()

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => setName(e.target.value)

  return (
    <input
      type="text"
      placeholder={LOGIN_NAME_PLACEHOLDER}
      value={name}
      onChange={onChange}
      disabled={isLoading}
      className={LOGIN_INPUT_CLASS}
    />
  )
}
