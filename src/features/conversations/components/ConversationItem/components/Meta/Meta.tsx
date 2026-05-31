import { Time }        from '../Time/Time'
import { UnreadBadge } from '../UnreadBadge/UnreadBadge'
import { PinButton }   from '../PinButton/PinButton'

const META_CLASS = 'flex flex-col items-end gap-1.5 shrink-0'

export function Meta() {
  return (
    <div className={META_CLASS}>
      <Time />
      <UnreadBadge />
      <PinButton />
    </div>
  )
}
