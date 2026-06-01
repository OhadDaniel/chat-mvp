import { MESSAGE_LIST_CLASS }   from './constants/MessageList.constants'
import type { MessageListProps } from './types/MessageList.types'

export function MessageList({ children, sentinelRef }: MessageListProps) {
  return (
    <div className={MESSAGE_LIST_CLASS}>
      {children}
      <div ref={sentinelRef} />
    </div>
  )
}
