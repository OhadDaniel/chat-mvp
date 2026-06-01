import { useBubbleContext } from './context/bubble.context'
import { UserAvatar }       from '@/features/user/components/UserAvatar/UserAvatar'
import { SENDER_NAME_CLASS } from './constants/Bubble.constants'

export function Bubble() {
  const { classes, content, time, senderName, senderInitials, isFromCurrentUser } = useBubbleContext()

  return (
    <div className={classes.wrapper}>
      <UserAvatar initials={senderInitials} name={senderName} size="sm" />
      <div className={classes.contentWrapper}>
        {!isFromCurrentUser && <span className={SENDER_NAME_CLASS}>{senderName}</span>}
        <div className={classes.bubble}>{content}</div>
        <span className={classes.time}>{time}</span>
      </div>
    </div>
  )
}
