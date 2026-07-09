import { useAuth }        from '@/features/auth/context/AuthContext'
import { useMessage }     from './context/Message.context'
import {
  buildWrapperClass,
  buildBubbleClass,
  buildContentWrapperClass,
  buildTimeClass,
  formatMessageTime,
}                         from './utils/bubble.utils'
import { BubbleProvider } from './context/bubble.context'
import { Bubble }         from './Bubble'

export function BubbleContainer() {
  const message           = useMessage()
  const { user }          = useAuth()
  const isFromCurrentUser = message.sender.id === user?.id

  const classes = {
    wrapper:        buildWrapperClass(isFromCurrentUser),
    bubble:         buildBubbleClass(isFromCurrentUser),
    contentWrapper: buildContentWrapperClass(isFromCurrentUser),
    time:           buildTimeClass(isFromCurrentUser),
  }

  return (
    <BubbleProvider value={{
      classes,
      content:           message.content,
      time:              formatMessageTime(message.sentAt),
      senderName:        message.sender.name,
      senderInitials:    message.sender.avatarInitials,
      isFromCurrentUser,
    }}>
      <Bubble />
    </BubbleProvider>
  )
}
