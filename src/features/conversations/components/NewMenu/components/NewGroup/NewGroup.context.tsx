import { createContext, useContext, type ReactNode } from 'react'
import { useNewGroup } from './hooks/useNewGroup'
import type { NewGroupContextValue } from './NewGroup.types'

export const NewGroupContext = createContext<NewGroupContextValue | null>(null)

export function useNewGroupContext(): NewGroupContextValue {
  const ctx = useContext(NewGroupContext)
  if (!ctx) throw new Error('useNewGroupContext must be used inside <NewGroupProvider>')
  return ctx
}

export function NewGroupProvider({ children }: { children: ReactNode }) {
  const value = useNewGroup()

  return (
    <NewGroupContext.Provider value={value}>
      {children}
    </NewGroupContext.Provider>
  )
}
