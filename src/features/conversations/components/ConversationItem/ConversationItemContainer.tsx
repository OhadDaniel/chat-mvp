import type { User }                from '@/features/user/types'
import type { Conversation }        from '@/features/conversations/types/index'
import { getConversationDisplay }   from '@/features/conversations/utils/conversations.utils'
import { ConversationItemContext }  from './ConversationItem.context'
import { ConversationItem }         from './ConversationItem'
import { formatTime }               from './utils/conversationItem.utils'

type TogglePin = (id: string, currentlyPinned: boolean) => Promise<void>

type Props = {
  conversation:          Conversation
  currentUser:           User
  selectedConversationId: string | null
  togglePin:             TogglePin
  onSelectConversation:  (id: string) => void
}

export function ConversationItemContainer({ conversation, currentUser, selectedConversationId, togglePin, onSelectConversation }: Props) {
  const display     = getConversationDisplay(conversation, currentUser.id)
  const isPinned    = conversation.pinnedAt !== null
  const isSelected  = conversation.id === selectedConversationId

  const contextValue = {
    initials:    display.initials,
    name:        display.title,
    avatarUrl:   display.avatarUrl,
    isGroup:     display.isGroup,
    lastMessage: conversation.lastMessage?.content ?? '',
    time:        formatTime(conversation.lastMessageAt),
    unreadCount: conversation.unreadCount,
    isPinned,
    isSelected,
    onTogglePin: () => togglePin(conversation.id, isPinned),
    onSelect:    () => onSelectConversation(conversation.id),
  }

  return (
    <ConversationItemContext.Provider value={contextValue}>
      <ConversationItem />
    </ConversationItemContext.Provider>
  )
}
