import { createContext, useContext, type ReactNode } from 'react'
import { useNewTutor } from './hooks/useNewTutor'
import type { NewTutorContextValue } from './NewTutor.types'

export const NewTutorContext = createContext<NewTutorContextValue | null>(null)

export function useNewTutorContext(): NewTutorContextValue {
  const ctx = useContext(NewTutorContext)
  if (!ctx) throw new Error('useNewTutorContext must be used inside <NewTutorProvider>')
  return ctx
}

export function NewTutorProvider({ children }: { children: ReactNode }) {
  const value = useNewTutor()

  return (
    <NewTutorContext.Provider value={value}>
      {children}
    </NewTutorContext.Provider>
  )
}
