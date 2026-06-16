import { useState } from 'react'
import type { AppNavContextValue, AppView } from '../context/AppNavContext'

export function useAppNav(): AppNavContextValue {
  const [view, setView] = useState<AppView>('chat')

  const goToProfile = () => setView('profile')
  const goToChat    = () => setView('chat')

  return { view, goToProfile, goToChat }
}
