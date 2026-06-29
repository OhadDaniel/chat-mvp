import { createContext, useContext, type ReactNode } from 'react'
import { useNewDirectMessage } from './hooks/useNewDirectMessage'
import type { NewDirectMessageContextValue } from './NewDirectMessage.types'

export const NewDirectMessageContext = createContext<NewDirectMessageContextValue | null>(null)

export function useNewDirectMessageContext(): NewDirectMessageContextValue {
  const ctx = useContext(NewDirectMessageContext)
  if (!ctx) throw new Error('useNewDirectMessageContext must be used inside <NewDirectMessageProvider>')
  return ctx
}

export function NewDirectMessageProvider({ children }: { children: ReactNode }) {
  const value = useNewDirectMessage()

  return (
    <NewDirectMessageContext.Provider value={value}>
      {children}
    </NewDirectMessageContext.Provider>
  )
}
