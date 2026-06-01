import type { ReactNode, RefObject } from 'react'

export type MessageListProps = {
  items:       ReactNode[]
  sentinelRef: RefObject<HTMLDivElement | null>
}
