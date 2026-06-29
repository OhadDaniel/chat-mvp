import type { BubbleProps } from './Bubble.types'
import { SENDER_NAME_CLASS } from './Bubble.constants'
import { UserAvatar }        from '@/features/user/components/UserAvatar/UserAvatar'
import { CitationsContainer } from './components/Citations/CitationsContainer'

export function Bubble({ classes, content, time, senderName, senderInitials, senderAvatarUrl, showSenderName, citations }: BubbleProps) {
  return (
    <div className={classes.wrapper}>
      <UserAvatar initials={senderInitials} name={senderName} avatarUrl={senderAvatarUrl} size="sm" />
      <div className={classes.contentWrapper}>
        {showSenderName && <span className={SENDER_NAME_CLASS}>{senderName}</span>}
        <div className={classes.bubble}>{content}</div>
        {citations.length > 0 ? <CitationsContainer citations={citations} /> : null}
        <span className={classes.time}>{time}</span>
      </div>
    </div>
  )
}
