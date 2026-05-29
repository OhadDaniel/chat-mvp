import { Time }        from '../Time/Time'
import { UnreadBadge } from '../UnreadBadge/UnreadBadge'
import { PinButton }   from '../PinButton/PinButton'

const META_CLASS = 'flex flex-col items-end gap-1.5 shrink-0'

type Props = {
  time:        string
  unreadCount: number
  isPinned:    boolean
  onTogglePin: () => void
}

export function Meta({ time, unreadCount, isPinned, onTogglePin }: Props) {
  return (
    <div className={META_CLASS}>
      <Time        time={time} />
      <UnreadBadge count={unreadCount} />
      <PinButton   isPinned={isPinned} onTogglePin={onTogglePin} />
    </div>
  )
}
