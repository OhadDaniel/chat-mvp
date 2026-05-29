import { useState }            from 'react'
import type { FormEvent }      from 'react'
import { useAuth }             from '@/features/auth/hooks/useAuth'
import { ApiRequestError }     from '@/api/apiClient'
import {
  LOGIN_ERROR_EMPTY,
  LOGIN_ERROR_NOT_FOUND,
  LOGIN_ERROR_API_FAILURE,
} from '../LoginScreen.constants'
import type { LoginContextValue } from '../LoginScreen.types'

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

  return { name, password, error, isLoading, setName, setPassword, handleSubmit }
}
