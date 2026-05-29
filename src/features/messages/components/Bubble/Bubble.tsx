import type { BubbleProps }  from './Bubble.types'
import { UserAvatar }         from '@/features/user/components/UserAvatar/UserAvatar'

export function Bubble({ wrapperClass, bubbleClass, contentWrapperClass, timeClass, content, time, senderName, senderInitials, senderNameNode }: BubbleProps) {
  return (
    <div className={wrapperClass}>
      <UserAvatar initials={senderInitials} name={senderName} size="sm" />
      <div className={contentWrapperClass}>
        {senderNameNode}
        <div className={bubbleClass}>{content}</div>
        <span className={timeClass}>{time}</span>
      </div>
    </div>
  )
}
