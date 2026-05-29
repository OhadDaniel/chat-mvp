import { MESSAGE_LIST_CLASS } from './MessageList.constants'
import type { MessageListProps } from './MessageList.types'

export function MessageList({ items, sentinelRef }: MessageListProps) {
  return (
    <div className={MESSAGE_LIST_CLASS}>
      {items}
      <div ref={sentinelRef} />
    </div>
  )
}
