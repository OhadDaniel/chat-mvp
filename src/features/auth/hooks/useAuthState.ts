import { useState, useEffect, useCallback } from 'react'
import type { User }                        from '@/features/auth/types/index'
import { authApi }                          from '@/api/apiClient'
import { STORAGE_KEY_TOKEN, STORAGE_KEY_USER } from '@/shared/constants'

type UseAuthStateReturn = {
  user:      User | null
  isLoading: boolean
  login:     (name: string, password: string) => Promise<void>
  logout:    () => void
}

export function useAuthState(): UseAuthStateReturn {
  const [user,      setUser]      = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_USER)
    if (!stored) return
    try {
      setUser(JSON.parse(stored) as User)
    } catch {
      localStorage.removeItem(STORAGE_KEY_USER)
    }
  }, [])

  const login = useCallback(async (name: string, password: string) => {
    setIsLoading(true)
    try {
      const { token, user } = await authApi.login({ name, password })
      localStorage.setItem(STORAGE_KEY_TOKEN, token)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)
    setUser(null)
  }, [])

  return { user, isLoading, login, logout }
}
