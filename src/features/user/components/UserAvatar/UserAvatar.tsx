import type { UserAvatarProps }   from './UserAvatar.types'
import { buildAvatarClassName }   from './UserAvatar.constants'

export function UserAvatar({ initials, name, size = 'md' }: UserAvatarProps) {
  const className = buildAvatarClassName(initials, size)

  return (
    <div role="img" aria-label={name} className={className}>
      {initials}
    </div>
  )
}
