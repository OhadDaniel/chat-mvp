import { useConversationItemContext } from '../../ConversationItem.context'

const UNREAD_BADGE_CLASS = 'bg-violet-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg shadow-violet-500/30'

export function UnreadBadge() {
  const { unreadCount } = useConversationItemContext()
  if (unreadCount === 0) return null
  return <span className={UNREAD_BADGE_CLASS}>{unreadCount}</span>
}
