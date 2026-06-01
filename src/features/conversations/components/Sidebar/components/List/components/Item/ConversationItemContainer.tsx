import type { MouseEvent }                from 'react'
import type { Conversation }              from '@/features/conversations/types/index'
import { useAuth }                        from '@/features/auth/context/AuthContext'
import { useConversationsContext }        from '@/features/conversations/context/conversations.context'
import { ConversationItemProvider }       from './context/ConversationItem.context'
import { ConversationItem }               from './ConversationItem'
import { getOtherParticipant, formatTime } from './utils/conversationItem.utils'
import { getPinButtonClass, getPinButtonLabel, getPinButtonAriaLabel } from './components/PinButton/pinButton.utils'

type Props = {
  conversation: Conversation
}

export function ConversationItemContainer({ conversation }: Props) {
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

  const contextValue = {
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
  }

  return (
    <ConversationItemProvider value={contextValue}>
      <ConversationItem />
    </ConversationItemProvider>
  )
}
