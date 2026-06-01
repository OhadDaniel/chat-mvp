import { createContext, type ReactNode } from 'react'
import type { User } from '@/features/user/types'
import { useAuthState } from '@/features/auth/hooks/useAuthState'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (name: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
