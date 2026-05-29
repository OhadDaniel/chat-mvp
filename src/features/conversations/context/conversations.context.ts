import { createContext, useContext } from 'react'
import type { UseConversationsReturn } from '../types'

export type ConversationsContextValue = UseConversationsReturn & {
  selectedConversationId: string | null
  onSelectConversation:   (id: string) => void
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null)

export function useConversationsContext(): ConversationsContextValue {
  const ctx = useContext(ConversationsContext)
  if (!ctx) throw new Error('useConversationsContext must be used inside ConversationsProvider')
  return ctx
}

export { ConversationsContext }
