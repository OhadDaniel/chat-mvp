import { useState }            from 'react'
import type { FormEvent }      from 'react'
import { useAuth }             from '@/features/auth/hooks/useAuth'
import { ApiRequestError }     from '@/api/client'
import {
  LOGIN_ERROR_EMPTY,
  LOGIN_ERROR_INVALID_CREDENTIALS,
  LOGIN_ERROR_API_FAILURE,
} from '../LoginScreen.constants'
import type { LoginContextValue } from '../LoginScreen.types'

export function useLoginScreen(): LoginContextValue {
  const { login }    = useAuth()
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError(LOGIN_ERROR_EMPTY)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await login(email.trim(), password)
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        setError(LOGIN_ERROR_INVALID_CREDENTIALS)
      } else {
        setError(LOGIN_ERROR_API_FAILURE)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { email, password, error, isLoading, setEmail, setPassword, handleSubmit }
}
