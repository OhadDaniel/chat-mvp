import { createContext, useContext } from 'react'

export type ConversationItemContextValue = {
  initials:    string
  name:        string
  lastMessage: string
  time:        string
  unreadCount: number
  isPinned:    boolean
  isSelected:  boolean
  onTogglePin: () => void
  onSelect:    () => void
}

export const ConversationItemContext = createContext<ConversationItemContextValue | null>(null)

export function useConversationItemContext(): ConversationItemContextValue {
  const ctx = useContext(ConversationItemContext)
  if (!ctx) throw new Error('useConversationItemContext must be used inside <ConversationItemContainer>')
  return ctx
}
