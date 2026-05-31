import type { BubbleContainerProps } from './Bubble.types'
import {
  buildWrapperClass,
  buildBubbleClass,
  buildContentWrapperClass,
  buildTimeClass,
  formatMessageTime,
}                                    from './utils/bubble.utils'
import { Bubble }                    from './Bubble'

export function BubbleContainer({ content, sentAt, senderName, senderInitials, isFromCurrentUser }: BubbleContainerProps) {
  const classes = {
    wrapper:        buildWrapperClass(isFromCurrentUser),
    bubble:         buildBubbleClass(isFromCurrentUser),
    contentWrapper: buildContentWrapperClass(isFromCurrentUser),
    time:           buildTimeClass(isFromCurrentUser),
  }

  return (
    <Bubble
      classes={classes}
      content={content}
      time={formatMessageTime(sentAt)}
      senderName={senderName}
      senderInitials={senderInitials}
      showSenderName={!isFromCurrentUser}
    />
  )
}
