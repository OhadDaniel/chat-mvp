import { createContext, useContext } from 'react'
import type { ReactNode }            from 'react'
import type { BubbleClasses }        from '../types/Bubble.types'

export type BubbleContextValue = {
  classes:           BubbleClasses
  content:           string
  time:              string
  senderName:        string
  senderInitials:    string
  isFromCurrentUser: boolean
}

const BubbleContext = createContext<BubbleContextValue | null>(null)

export function useBubbleContext(): BubbleContextValue {
  const ctx = useContext(BubbleContext)
  if (!ctx) throw new Error('useBubbleContext must be used inside <BubbleContainer>')
  return ctx
}

type Props = {
  value:    BubbleContextValue
  children: ReactNode
}

export function BubbleProvider({ value, children }: Props) {
  return (
    <BubbleContext.Provider value={value}>
      {children}
    </BubbleContext.Provider>
  )
}
