import { createContext, useContext, type ReactNode } from 'react'
import type { User }        from '@/features/user/types'
import { useAuthState }     from '@/features/auth/hooks/useAuthState'

export type AuthContextValue = {
  user:      User | null
  isLoading: boolean
  login:     (name: string, password: string) => Promise<void>
  logout:    () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
