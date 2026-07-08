import { useConversationItemContext } from '../../ConversationItem.context'

const TIME_CLASS = 'font-mono text-[10px] tracking-[0.06em] text-faint'

export function Time() {
  const { time } = useConversationItemContext()
  return <span className={TIME_CLASS}>{time}</span>
}
