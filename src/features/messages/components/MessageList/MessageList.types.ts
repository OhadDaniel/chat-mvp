import type { RefObject } from 'react'
import type { Message } from '@/features/messages/types'

export type MessageListProps = {
  messages:      Message[]
  currentUserId: string
  sentinelRef:   RefObject<HTMLDivElement | null>
}
