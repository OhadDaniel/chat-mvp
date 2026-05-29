import type { ChangeEvent }  from 'react'
import { useLoginContext }   from '@/features/auth/components/LoginScreen/LoginScreen.context'
import type { LoginFormProps } from '../LoginForm.types'

export function useLoginForm(): LoginFormProps {
  const { name, password, error, isLoading, setName, setPassword, handleSubmit } =
    useLoginContext()

  const onNameChange     = (e: ChangeEvent<HTMLInputElement>): void => setName(e.target.value)
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)

  return { name, password, error, isLoading, onNameChange, onPasswordChange, onSubmit: handleSubmit }
}
