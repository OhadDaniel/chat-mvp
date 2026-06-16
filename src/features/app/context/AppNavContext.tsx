import { createContext, useContext, type ReactNode } from 'react'
import { useAppNav } from '../hooks/useAppNav'

export type AppView = 'chat' | 'profile'

export type AppNavContextValue = {
  view:        AppView
  goToProfile: () => void
  goToChat:    () => void
}

const AppNavContext = createContext<AppNavContextValue | null>(null)

export function useAppNavContext(): AppNavContextValue {
  const ctx = useContext(AppNavContext)
  if (!ctx) throw new Error('useAppNavContext must be used inside <AppNavProvider>')
  return ctx
}

export function AppNavProvider({ children }: { children: ReactNode }) {
  const nav = useAppNav()
  return <AppNavContext.Provider value={nav}>{children}</AppNavContext.Provider>
}
