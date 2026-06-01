import type { Message }              from '@/features/messages/types'
import { useMessageListContext }      from '../../context/messageList.context'
import {
  buildWrapperClass,
  buildBubbleClass,
  buildContentWrapperClass,
  buildTimeClass,
  formatMessageTime,
}                                    from './utils/bubble.utils'
import { SENDER_NAME_CLASS }         from './constants/Bubble.constants'
import { BubbleProvider }            from './context/bubble.context'
import { Bubble }                    from './Bubble'

type Props = {
  message: Message
}

export function BubbleContainer({ message }: Props) {
  const { currentUser }   = useMessageListContext()
  const isFromCurrentUser = message.sender.id === currentUser.id

  const classes = {
    wrapper:        buildWrapperClass(isFromCurrentUser),
    bubble:         buildBubbleClass(isFromCurrentUser),
    contentWrapper: buildContentWrapperClass(isFromCurrentUser),
    time:           buildTimeClass(isFromCurrentUser),
  }

  const senderNameNode = isFromCurrentUser
    ? null
    : <span className={SENDER_NAME_CLASS}>{message.sender.name}</span>

  return (
    <BubbleProvider value={{
      classes,
      content:        message.content,
      time:           formatMessageTime(message.sentAt),
      senderName:     message.sender.name,
      senderInitials: message.sender.avatarInitials,
      senderNameNode,
    }}>
      <Bubble />
    </BubbleProvider>
  )
}
