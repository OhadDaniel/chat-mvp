import { createContext, useContext } from 'react'
import type { ReactNode }            from 'react'
import type { Message }              from '@/features/messages/types'

const MessageContext = createContext<Message | null>(null)

export function useMessage(): Message {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessage must be used inside <MessageProvider>')
  return ctx
}

type Props = {
  value:    Message
  children: ReactNode
}

export function MessageProvider({ value, children }: Props) {
  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}
