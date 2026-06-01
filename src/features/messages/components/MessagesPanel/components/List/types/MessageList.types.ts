import type { ReactNode, RefObject } from 'react'

export type MessageListProps = {
  children:    ReactNode
  sentinelRef: RefObject<HTMLDivElement | null>
}
