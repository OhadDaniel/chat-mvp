import { useState } from 'react'
import type { AuthScreensMode } from '../AuthScreens.types'

export function useAuthScreens() {
  const [mode, setMode] = useState<AuthScreensMode>('login')

  const switchToLogin  = () => setMode('login')
  const switchToSignup = () => setMode('signup')

  return { mode, switchToLogin, switchToSignup }
}
