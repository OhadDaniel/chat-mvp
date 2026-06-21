import type { UserAvatarProps }                       from './UserAvatar.types'
import { buildAvatarClassName, buildAvatarImageClassName } from './UserAvatar.constants'

export function UserAvatar({ initials, name, size = 'md', avatarUrl }: UserAvatarProps) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={buildAvatarImageClassName(size)} />
  }

  const className = buildAvatarClassName(initials, size)

  return (
    <div role="img" aria-label={name} className={className}>
      {initials}
    </div>
  )
}
