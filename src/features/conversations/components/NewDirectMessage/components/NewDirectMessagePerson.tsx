import type { UserProfile } from '@/features/user/types'
import { UserAvatar } from '@/features/user/components/UserAvatar/UserAvatar'
import { useNewDirectMessageContext } from '../NewDirectMessage.context'
import {
  NEW_DM_ROW_CLASS,
  NEW_DM_ROW_NAME_CLASS,
} from '../NewDirectMessage.constants'

type Props = {
  user: UserProfile
}

export function NewDirectMessagePerson({ user }: Props) {
  const { selectUser, busy } = useNewDirectMessageContext()

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void selectUser(user.id)}
      className={NEW_DM_ROW_CLASS}
    >
      <UserAvatar
        initials={user.avatarInitials}
        name={user.name}
        size="sm"
        avatarUrl={user.avatarUrl}
      />
      <span className={NEW_DM_ROW_NAME_CLASS}>{user.name}</span>
    </button>
  )
}
