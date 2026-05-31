import { useConversationItemContext }                                        from './ConversationItem.context'
import { CONVERSATION_ITEM_CLASS, CONVERSATION_ITEM_SELECTED_CLASS }        from './ConversationItem.constants'
import { Avatar }                                                            from './components/Avatar/Avatar'
import { Content }                                                           from './components/Content/Content'
import { Meta }                                                              from './components/Meta/Meta'

export function ConversationItem() {
  const { isSelected, onSelect } = useConversationItemContext()
  const itemClass = isSelected ? CONVERSATION_ITEM_SELECTED_CLASS : CONVERSATION_ITEM_CLASS

  return (
    <li onClick={onSelect} className={itemClass}>
      <Avatar />
      <Content />
      <Meta />
    </li>
  )
}
