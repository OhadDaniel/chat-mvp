import {
  SIZE_CLASSES,
  buildAvatarImageClassName,
} from '@/features/user/components/UserAvatar/UserAvatar.constants'
import { UsersGlyph } from '@/shared/components/UsersGlyph'
import type { GroupAvatarProps } from './GroupAvatar.types'
import {
  GROUP_AVATAR_GLYPH_CLASS,
  GROUP_AVATAR_GLYPH_ICON_CLASS,
} from './GroupAvatar.constants'

export function GroupAvatar({ name, avatarUrl, size = 'md' }: GroupAvatarProps) {
  return avatarUrl ? (
    <img src={avatarUrl} alt={name} className={buildAvatarImageClassName(size)} />
  ) : (
    <div
      role="img"
      aria-label={name}
      className={`${GROUP_AVATAR_GLYPH_CLASS} ${SIZE_CLASSES[size]}`}
    >
      <UsersGlyph className={GROUP_AVATAR_GLYPH_ICON_CLASS} />
    </div>
  )
}
