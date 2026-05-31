import type { BubbleProps } from './Bubble.types'
import { SENDER_NAME_CLASS } from './Bubble.constants'
import { UserAvatar }        from '@/features/user/components/UserAvatar/UserAvatar'

export function Bubble({ classes, content, time, senderName, senderInitials, showSenderName }: BubbleProps) {
  return (
    <div className={classes.wrapper}>
      <UserAvatar initials={senderInitials} name={senderName} size="sm" />
      <div className={classes.contentWrapper}>
        {showSenderName && <span className={SENDER_NAME_CLASS}>{senderName}</span>}
        <div className={classes.bubble}>{content}</div>
        <span className={classes.time}>{time}</span>
      </div>
    </div>
  )
}
