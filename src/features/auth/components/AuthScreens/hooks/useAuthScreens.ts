import { useState } from 'react'
import type { AuthScreensContextValue, AuthScreensMode } from '../AuthScreens.types'

export function useAuthScreens(): AuthScreensContextValue {
  const [mode, setMode] = useState<AuthScreensMode>('login')

  const switchToLogin  = () => setMode('login')
  const switchToSignup = () => setMode('signup')

  return { mode, switchToLogin, switchToSignup }
}
