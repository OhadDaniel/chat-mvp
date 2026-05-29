import type { BubbleContainerProps }  from './Bubble.types'
import { SENDER_NAME_CLASS }           from './Bubble.constants'
import {
  buildWrapperClass,
  buildBubbleClass,
  buildContentWrapperClass,
  buildTimeClass,
  formatMessageTime,
}                                       from './utils/bubble.utils'
import { Bubble }                       from './Bubble'

export function BubbleContainer({ content, sentAt, senderName, senderInitials, isOwn }: BubbleContainerProps) {
  const wrapperClass        = buildWrapperClass(isOwn)
  const bubbleClass         = buildBubbleClass(isOwn)
  const contentWrapperClass = buildContentWrapperClass(isOwn)
  const timeClass           = buildTimeClass(isOwn)
  const time                = formatMessageTime(sentAt)
  const senderNameNode      = isOwn
    ? null
    : <span className={SENDER_NAME_CLASS}>{senderName}</span>

  return (
    <Bubble
      wrapperClass={wrapperClass}
      bubbleClass={bubbleClass}
      contentWrapperClass={contentWrapperClass}
      timeClass={timeClass}
      content={content}
      time={time}
      senderName={senderName}
      senderInitials={senderInitials}
      senderNameNode={senderNameNode}
    />
  )
}
