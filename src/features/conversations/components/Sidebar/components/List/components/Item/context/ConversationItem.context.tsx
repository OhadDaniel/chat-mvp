import { createContext, useContext } from 'react'
import type { ReactNode }            from 'react'

export type ConversationItemContextValue = {
  initials:          string
  name:              string
  lastMessage:       string
  time:              string
  unreadCount:       number
  isSelected:        boolean
  pinButtonClass:    string
  pinButtonLabel:    string
  pinButtonAriaLabel: string
  onPinClick:        (e: React.MouseEvent) => void
  onSelect:          () => void
}

const ConversationItemContext = createContext<ConversationItemContextValue | null>(null)

export function useConversationItemContext(): ConversationItemContextValue {
  const ctx = useContext(ConversationItemContext)
  if (!ctx) throw new Error('useConversationItemContext must be used inside <ConversationItemContainer>')
  return ctx
}

type Props = {
  value:    ConversationItemContextValue
  children: ReactNode
}

export function ConversationItemProvider({ value, children }: Props) {
  return (
    <ConversationItemContext.Provider value={value}>
      {children}
    </ConversationItemContext.Provider>
  )
}
