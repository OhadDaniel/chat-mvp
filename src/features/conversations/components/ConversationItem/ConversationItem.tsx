import type { ConversationItemProps }                                       from './ConversationItem.types'
import { CONVERSATION_ITEM_CLASS, CONVERSATION_ITEM_SELECTED_CLASS }        from './ConversationItem.constants'
import { Avatar }                                                            from './components/Avatar/Avatar'
import { Content }                                                           from './components/Content/Content'
import { Meta }                                                              from './components/Meta/Meta'

export function ConversationItem({ initials, name, lastMessage, time, unreadCount, isPinned, isSelected, onTogglePin, onSelect }: ConversationItemProps) {
  const itemClass = isSelected ? CONVERSATION_ITEM_SELECTED_CLASS : CONVERSATION_ITEM_CLASS

  return (
    <li onClick={onSelect} className={itemClass}>
      <Avatar  initials={initials} name={name} />
      <Content name={name} lastMessage={lastMessage} />
      <Meta    time={time} unreadCount={unreadCount} isPinned={isPinned} onTogglePin={onTogglePin} />
    </li>
  )
}
