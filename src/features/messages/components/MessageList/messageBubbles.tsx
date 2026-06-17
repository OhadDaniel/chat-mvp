import type { Message }    from '@/features/messages/types'
import { BubbleContainer } from '../Bubble/BubbleContainer'

type Props = {
  messages:      Message[]
  currentUserId: string
}

export function MessageBubbles({ messages, currentUserId }: Props) {
  return (
    <>
      {messages.map((message) => (
        <BubbleContainer
          key={message.id}
          content={message.content}
          sentAt={message.sentAt}
          senderName={message.sender.name}
          senderInitials={message.sender.avatarInitials}
          senderAvatarUrl={message.sender.avatarUrl}
          isFromCurrentUser={message.sender.id === currentUserId}
        />
      ))}
    </>
  )
}
