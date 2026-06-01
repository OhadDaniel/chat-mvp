export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export type UserAvatarProps = {
  initials: string
  name:     string
  size?:    AvatarSize
}
