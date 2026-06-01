import { useBubbleContext } from './context/bubble.context'
import { UserAvatar }       from '@/features/user/components/UserAvatar/UserAvatar'

export function Bubble() {
  const { classes, content, time, senderName, senderInitials, senderNameNode } = useBubbleContext()

  return (
    <div className={classes.wrapper}>
      <UserAvatar initials={senderInitials} name={senderName} size="sm" />
      <div className={classes.contentWrapper}>
        {senderNameNode}
        <div className={classes.bubble}>{content}</div>
        <span className={classes.time}>{time}</span>
      </div>
    </div>
  )
}
