import type { MouseEvent }               from 'react'
import { useAuth }                       from '@/features/auth/context/AuthContext'
import { useConversationsContext }       from '@/features/conversations/context/conversations.context'
import { useConversation }               from './context/Conversation.context'
import { ConversationItemProvider }      from './context/ConversationItem.context'
import { ConversationItem }              from './ConversationItem'
import { getOtherParticipant, formatTime } from './utils/conversationItem.utils'
import { getPinButtonClass, getPinButtonLabel, getPinButtonAriaLabel } from './components/PinButton/pinButton.utils'

export function ConversationItemContainer() {
  const conversation                                                = useConversation()
  const { user }                                                    = useAuth()
  const { selectedConversationId, togglePin, onSelectConversation } = useConversationsContext()

  if (!user) return null

  const other      = getOtherParticipant(conversation.participants, user.id)
  const isPinned   = conversation.pinnedAt !== null
  const isSelected = conversation.id === selectedConversationId

  const onPinClick = (e: MouseEvent) => {
    e.stopPropagation()
    togglePin(conversation.id, isPinned)
  }

  return (
    <ConversationItemProvider value={{
      initials:           other.avatarInitials,
      name:               other.name,
      lastMessage:        conversation.lastMessage?.content ?? '',
      time:               formatTime(conversation.lastMessageAt),
      unreadCount:        conversation.unreadCount,
      isSelected,
      pinButtonClass:     getPinButtonClass(isPinned),
      pinButtonLabel:     getPinButtonLabel(isPinned),
      pinButtonAriaLabel: getPinButtonAriaLabel(isPinned),
      onPinClick,
      onSelect:           () => onSelectConversation(conversation.id),
    }}>
      <ConversationItem />
    </ConversationItemProvider>
  )
}
