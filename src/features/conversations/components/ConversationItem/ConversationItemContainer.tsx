import type { User }                from '@/features/user/types'
import type { Conversation }        from '@/features/conversations/types/index'
import { ConversationItemContext }  from './ConversationItem.context'
import { ConversationItem }         from './ConversationItem'
import { getOtherParticipant, formatTime } from './utils/conversationItem.utils'

type TogglePin = (id: string, currentlyPinned: boolean) => Promise<void>

type Props = {
  conversation:          Conversation
  currentUser:           User
  selectedConversationId: string | null
  togglePin:             TogglePin
  onSelectConversation:  (id: string) => void
}

export function ConversationItemContainer({ conversation, currentUser, selectedConversationId, togglePin, onSelectConversation }: Props) {
  const other       = getOtherParticipant(conversation.participants, currentUser.id)
  const isPinned    = conversation.pinnedAt !== null
  const isSelected  = conversation.id === selectedConversationId

  const contextValue = {
    initials:    other.avatarInitials,
    name:        other.name,
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
