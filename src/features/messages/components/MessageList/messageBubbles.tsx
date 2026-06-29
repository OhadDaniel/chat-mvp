import type { AiSender, Message } from '@/features/messages/types'
import { resolveSenderDisplay } from '@/features/messages/utils/messages.utils'
import { BubbleContainer } from '../Bubble/BubbleContainer'

type Props = {
  messages:      Message[]
  currentUserId: string
  aiSender:      AiSender
}

export function MessageBubbles({ messages, currentUserId, aiSender }: Props) {
  return (
    <>
      {messages.map((message) => {
        const sender = resolveSenderDisplay(message, aiSender)
        return (
          <BubbleContainer
            key={message.id}
            content={message.content}
            sentAt={message.sentAt}
            senderName={sender.name}
            senderInitials={sender.initials}
            senderAvatarUrl={sender.avatarUrl}
            isFromCurrentUser={message.sender.id === currentUserId}
            citations={message.citations ?? []}
          />
        )
      })}
    </>
  )
}
