import { useConversationItemContext } from '../../ConversationItem.context'
import { UserAvatar }                from '@/features/user/components/UserAvatar/UserAvatar'

export function Avatar() {
  const { initials, name } = useConversationItemContext()
  return <UserAvatar initials={initials} name={name} size="md" />
}
