import { useState, useCallback } from 'react'
import type { AuthScreensContextValue, AuthScreensMode } from '../AuthScreens.types'

export function useAuthScreens(): AuthScreensContextValue {
  const [mode, setMode] = useState<AuthScreensMode>('login')

  const switchToLogin  = useCallback(() => setMode('login'), [])
  const switchToSignup = useCallback(() => setMode('signup'), [])

  return { mode, switchToLogin, switchToSignup }
}
