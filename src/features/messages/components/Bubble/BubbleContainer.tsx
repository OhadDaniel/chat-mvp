import type { BubbleContainerProps } from './Bubble.types'
import {
  buildWrapperClass,
  buildBubbleClass,
  buildContentWrapperClass,
  buildTimeClass,
  formatMessageTime,
}                                    from './utils/bubble.utils'
import { Bubble }                    from './Bubble'

export function BubbleContainer({ content, sentAt, senderName, senderInitials, senderAvatarUrl, isFromCurrentUser, citations }: BubbleContainerProps) {
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
      senderAvatarUrl={senderAvatarUrl}
      showSenderName={!isFromCurrentUser}
      citations={citations}
    />
  )
}
