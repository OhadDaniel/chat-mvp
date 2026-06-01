import { createContext, useContext } from 'react'
import type { ReactNode }            from 'react'
import type { User }                 from '@/features/user/types'

export type MessageListContextValue = {
  currentUser: User
}

const MessageListContext = createContext<MessageListContextValue | null>(null)

export function useMessageListContext(): MessageListContextValue {
  const ctx = useContext(MessageListContext)
  if (!ctx) throw new Error('useMessageListContext must be used inside <MessageListContainer>')
  return ctx
}

type Props = {
  value:    MessageListContextValue
  children: ReactNode
}

export function MessageListProvider({ value, children }: Props) {
  return (
    <MessageListContext.Provider value={value}>
      {children}
    </MessageListContext.Provider>
  )
}
