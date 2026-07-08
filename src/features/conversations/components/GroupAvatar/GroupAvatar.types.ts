import type { AvatarSize } from '@/features/user/components/UserAvatar/UserAvatar.types'

export type GroupAvatarProps = {
  name:       string
  avatarUrl:  string | null
  size?:      AvatarSize
}
