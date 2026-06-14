import { useState }            from 'react'
import type { FormEvent }      from 'react'
import { useAuth }             from '@/features/auth/hooks/useAuth'
import { ApiRequestError }     from '@/api/client'
import {
  SIGNUP_ERROR_EMPTY,
  SIGNUP_ERROR_EMAIL_TAKEN,
  SIGNUP_ERROR_INVALID_FIELDS,
  SIGNUP_ERROR_API_FAILURE,
} from '../SignupScreen.constants'
import type { SignupContextValue } from '../SignupScreen.types'

export function useSignupScreen(): SignupContextValue {
  const { signup }   = useAuth()
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(SIGNUP_ERROR_EMPTY)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await signup(email.trim(), password, name.trim())
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        setError(SIGNUP_ERROR_EMAIL_TAKEN)
      } else if (err instanceof ApiRequestError && err.status === 400) {
        setError(SIGNUP_ERROR_INVALID_FIELDS)
      } else {
        setError(SIGNUP_ERROR_API_FAILURE)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { name, email, password, error, isLoading, setName, setEmail, setPassword, handleSubmit }
}
