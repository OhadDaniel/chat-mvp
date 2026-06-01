import { createContext, useContext } from 'react'
import type { ReactNode }            from 'react'
import type { Conversation }         from '@/features/conversations/types/index'

const ConversationContext = createContext<Conversation | null>(null)

export function useConversation(): Conversation {
  const ctx = useContext(ConversationContext)
  if (!ctx) throw new Error('useConversation must be used inside <ConversationProvider>')
  return ctx
}

type Props = {
  value:    Conversation
  children: ReactNode
}

export function ConversationProvider({ value, children }: Props) {
  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
