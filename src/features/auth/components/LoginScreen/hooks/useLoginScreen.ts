import { useState }                    from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useAuth }             from '@/features/auth/context/AuthContext'
import { ApiRequestError }     from '@/api/apiClient'
import {
  LOGIN_ERROR_EMPTY,
  LOGIN_ERROR_NOT_FOUND,
  LOGIN_ERROR_API_FAILURE,
} from '../constants/LoginScreen.constants'
import type { LoginContextValue } from '../types/LoginScreen.types'

export function useLoginScreen(): LoginContextValue {
  const { login }    = useAuth()
  const [name,      setName]      = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!name.trim() || !password.trim()) {
      setError(LOGIN_ERROR_EMPTY)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await login(name.trim(), password)
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 404) {
        setError(LOGIN_ERROR_NOT_FOUND)
      } else {
        setError(LOGIN_ERROR_API_FAILURE)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onNameChange     = (e: ChangeEvent<HTMLInputElement>): void => setName(e.target.value)
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)

  return { name, password, error, isLoading, onNameChange, onPasswordChange, handleSubmit }
}
