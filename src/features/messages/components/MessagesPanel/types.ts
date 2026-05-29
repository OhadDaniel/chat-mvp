import type { ReactNode } from 'react'

export type MessagesPanelProps = {
  contentNode:  ReactNode
  composerNode: ReactNode
  title:        string
}

export type MessagesPanelContainerProps = {
  conversationId:   string | null
  conversationName: string | null
}
