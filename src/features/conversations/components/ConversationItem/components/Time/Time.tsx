import { useConversationItemContext } from '../../ConversationItem.context'

const TIME_CLASS = 'text-xs text-slate-500'

export function Time() {
  const { time } = useConversationItemContext()
  return <span className={TIME_CLASS}>{time}</span>
}
