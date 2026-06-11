import { createContext, useContext } from 'react'
import type { AuthScreensContextValue } from './AuthScreens.types'

export const AuthScreensContext = createContext<AuthScreensContextValue | null>(null)

export function useAuthScreensContext(): AuthScreensContextValue {
  const ctx = useContext(AuthScreensContext)
  if (!ctx) throw new Error('useAuthScreensContext must be used inside <AuthScreens>')
  return ctx
}
