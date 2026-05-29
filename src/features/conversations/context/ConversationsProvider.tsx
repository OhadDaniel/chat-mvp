import type { ReactNode }                                   from 'react'
import type { ConversationsContextValue }                   from './conversations.context'
import { ConversationsContext }                             from './conversations.context'

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
