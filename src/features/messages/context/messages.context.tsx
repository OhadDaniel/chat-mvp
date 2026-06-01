import { createContext, useContext } from 'react'
import type { ReactNode }           from 'react'
import type { Message }             from '@/features/messages/types'
import type { MessagesStatus }      from '@/features/messages/types'
import { useMessages }              from '@/features/messages/hooks/useMessages'

export type MessagesContextValue = {
  messages:          Message[]
  status:            MessagesStatus
  sendMessage:       (content: string) => Promise<void>
  retryLoadMessages: () => void
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

export function useMessagesContext(): MessagesContextValue {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessagesContext must be used inside <MessagesProvider>')
  return ctx
}

type Props = {
  conversationId: string | null
  children:       ReactNode
}

export function MessagesProvider({ conversationId, children }: Props) {
  const value = useMessages(conversationId)
  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}
