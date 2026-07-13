import type { RefObject } from 'react'
import type { AiSender, Message } from '@/features/messages/types'

export type MessageListProps = {
  messages:      Message[]
  currentUserId: string
  sentinelRef:   RefObject<HTMLDivElement | null>
  aiSender:      AiSender
}
