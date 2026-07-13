import type { UserProfile } from '@/features/user/types'
import { UserAvatar } from '@/features/user/components/UserAvatar/UserAvatar'
import { useNewGroupContext } from '../NewGroup.context'
import { NEW_GROUP_ROW_NAME_CLASS, NEW_GROUP_CHECK_CLASS } from '../NewGroup.constants'
import {
  getPersonRowClass,
  getPersonCheckGlyph,
} from '../utils/newGroupPerson.utils'

type Props = {
  user: UserProfile
}

export function NewGroupPerson({ user }: Props) {
  const { isSelected, toggle, busy } = useNewGroupContext()
  const selected = isSelected(user.id)

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => toggle(user.id)}
      className={getPersonRowClass(selected)}
    >
      <UserAvatar
        initials={user.avatarInitials}
        name={user.name}
        size="sm"
        avatarUrl={user.avatarUrl}
      />
      <span className={NEW_GROUP_ROW_NAME_CLASS}>{user.name}</span>
      <span className={NEW_GROUP_CHECK_CLASS}>{getPersonCheckGlyph(selected)}</span>
    </button>
  )
}
