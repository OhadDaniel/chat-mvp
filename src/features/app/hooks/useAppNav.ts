import { useState } from 'react'
import type { AppView } from '../context/AppNavContext'

export function useAppNav() {
  const [view, setView] = useState<AppView>('chat')

  const goToProfile = () => setView('profile')
  const goToChat    = () => setView('chat')

  return { view, goToProfile, goToChat }
}
