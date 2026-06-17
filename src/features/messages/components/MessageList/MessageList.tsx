import { MESSAGE_LIST_CLASS } from './MessageList.constants'
import { MessageBubbles } from './MessageBubbles'
import type { MessageListProps } from './MessageList.types'

export function MessageList({ messages, currentUserId, sentinelRef }: MessageListProps) {
  return (
    <div className={MESSAGE_LIST_CLASS}>
      <MessageBubbles messages={messages} currentUserId={currentUserId} />
      <div ref={sentinelRef} />
    </div>
  )
}
