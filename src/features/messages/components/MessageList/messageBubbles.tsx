import type { ReactNode }    from 'react'
import type { Message }      from '@/features/messages/types'
import type { User }         from '@/features/user/types'
import { BubbleContainer }   from '../Bubble/BubbleContainer'

export function buildMessageBubbles(messages: Message[], user: User): ReactNode[] {
  return messages.map((message) => (
    <BubbleContainer
      key={message.id}
      content={message.content}
      sentAt={message.sentAt}
      senderName={message.sender.name}
      senderInitials={message.sender.avatarInitials}
      isFromCurrentUser={message.sender.id === user.id}
    />
  ))
}
