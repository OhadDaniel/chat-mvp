import { UserAvatar } from '@/features/user/components/UserAvatar/UserAvatar'

type Props = {
  initials: string
  name:     string
}

export function Avatar({ initials, name }: Props) {
  return <UserAvatar initials={initials} name={name} size="md" />
}
