const UNREAD_BADGE_CLASS = 'bg-violet-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg shadow-violet-500/30'

type Props = { count: number }

export function UnreadBadge({ count }: Props) {
  if (count === 0) return null
  return <span className={UNREAD_BADGE_CLASS}>{count}</span>
}
