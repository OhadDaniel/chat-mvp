import { useConversationItemContext } from '../../ConversationItem.context'

const UNREAD_BADGE_CLASS = 'bg-accent text-white font-mono text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center'

export function UnreadBadge() {
  const { unreadCount } = useConversationItemContext()
  if (unreadCount === 0) return null
  return <span className={UNREAD_BADGE_CLASS}>{unreadCount}</span>
}
