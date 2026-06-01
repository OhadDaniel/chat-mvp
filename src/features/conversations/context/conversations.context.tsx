import { createContext, useContext } from 'react'
import type { ReactNode }            from 'react'
import type { UseConversationsReturn, Conversation } from '../types'

export type ConversationsContextValue = UseConversationsReturn & {
  selectedConversationId:   string | null
  selectedConversation:     Conversation | null
  selectedConversationName: string | null
  onSelectConversation:     (id: string) => void
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null)

export function useConversationsContext(): ConversationsContextValue {
  const ctx = useContext(ConversationsContext)
  if (!ctx) throw new Error('useConversationsContext must be used inside ConversationsProvider')
  return ctx
}

type Props = {
  value:    ConversationsContextValue
  children: ReactNode
}

export function ConversationsProvider({ value, children }: Props) {
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}
