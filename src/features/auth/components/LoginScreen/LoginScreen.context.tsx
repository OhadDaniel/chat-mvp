import { createContext, useContext } from 'react'
import type { LoginContextValue } from './LoginScreen.types'

export const LoginContext = createContext<LoginContextValue | null>(null)

export function useLoginContext(): LoginContextValue {
  const ctx = useContext(LoginContext)
  if (!ctx) throw new Error('useLoginContext must be used inside <LoginScreen>')
  return ctx
}
