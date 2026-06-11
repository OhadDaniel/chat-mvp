import { useState, useEffect, useCallback } from 'react'
import type { User }                        from '@/features/auth/types/index'
import { authApi }                          from '@/api/apiClient'
import { STORAGE_KEY_TOKEN }                from '@/shared/constants'

type UseAuthStateReturn = {
  user:      User | null
  isLoading: boolean
  login:     (email: string, password: string) => Promise<void>
  signup:    (email: string, password: string, name: string) => Promise<void>
  logout:    () => void
}

export function useAuthState(): UseAuthStateReturn {
  const [user,      setUser]      = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // session restore: the token is the only thing we persist —
  // /me verifies it server-side and returns a fresh user
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem(STORAGE_KEY_TOKEN))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { token, user } = await authApi.login({ email, password })
      localStorage.setItem(STORAGE_KEY_TOKEN, token)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const { token, user } = await authApi.signup({ email, password, name })
      localStorage.setItem(STORAGE_KEY_TOKEN, token)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    setUser(null)
  }, [])

  return { user, isLoading, login, signup, logout }
}
