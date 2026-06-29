import { createContext, useContext, type ReactNode } from 'react'
import { useNewMenu } from './hooks/useNewMenu'
import type { NewMenuContextValue } from './NewMenu.types'

export const NewMenuContext = createContext<NewMenuContextValue | null>(null)

export function useNewMenuContext(): NewMenuContextValue {
  const ctx = useContext(NewMenuContext)
  if (!ctx) throw new Error('useNewMenuContext must be used inside <NewMenuProvider>')
  return ctx
}

export function NewMenuProvider({ children }: { children: ReactNode }) {
  const value = useNewMenu()

  return (
    <NewMenuContext.Provider value={value}>
      {children}
    </NewMenuContext.Provider>
  )
}
