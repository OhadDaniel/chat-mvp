import { useConversationItemContext } from '../../ConversationItem.context'
import { UserAvatar }                from '@/features/user/components/UserAvatar/UserAvatar'
import { GroupAvatar }               from '@/features/conversations/components/GroupAvatar/GroupAvatar'

export function Avatar() {
  const { initials, name, avatarUrl, isGroup } = useConversationItemContext()

  return isGroup ? (
    <GroupAvatar name={name} avatarUrl={avatarUrl} size="md" />
  ) : (
    <UserAvatar initials={initials} name={name} avatarUrl={avatarUrl} size="md" />
  )
}
