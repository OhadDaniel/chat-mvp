import type { ReactNode } from 'react'

export type MessagesPanelProps = {
  title:    string
  actions?: ReactNode
  children: ReactNode
}

export type MessagesPanelContainerProps = {
  conversationId:   string | null
  conversationName: string | null
  actions?:         ReactNode
}
