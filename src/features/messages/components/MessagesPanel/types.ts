import type { ReactNode } from 'react'

export type MessagesPanelProps = {
  title:    string
  children: ReactNode
}

export type MessagesPanelContainerProps = {
  conversationId:   string | null
  conversationName: string | null
}
