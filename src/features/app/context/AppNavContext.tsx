import { createContext, useContext, type ReactNode } from 'react'
import { useAppNav } from '../hooks/useAppNav'

export type AppView = 'chat' | 'profile'

// Derived from the hook so it can't drift from what the hook returns (context.md).
export type AppNavContextValue = ReturnType<typeof useAppNav>

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
