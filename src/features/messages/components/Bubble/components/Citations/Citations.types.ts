import type { Citation } from '@/features/messages/types'

export type CitationsContainerProps = {
  citations: Citation[]
}

export type CitationsProps = {
  citations: Citation[]
  expanded:  boolean
  onToggle:  () => void
}
