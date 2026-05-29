import type { ReactNode }                       from 'react'
import type { User }                            from '@/features/user/types'
import type { Conversation }                   from '@/features/conversations/types/index'
import { ConversationItem }                    from './ConversationItem'
import { getOtherParticipant, formatTime }     from './utils/conversationItem.utils'

type TogglePin = (id: string, currentlyPinned: boolean) => Promise<void>

export function buildConversationItems(
  conversations:          Conversation[],
  togglePin:              TogglePin,
  user:                   User,
  selectedConversationId: string | null,
  onSelectConversation:   (id: string) => void,
): ReactNode[] {
  return conversations.map(c => {
    const other       = getOtherParticipant(c.participants, user.id)
    const time        = formatTime(c.lastMessageAt)
    const isPinned    = c.pinnedAt !== null
    const lastMessage = c.lastMessage?.content ?? ''

    return (
      <ConversationItem
        key={c.id}
        initials={other.avatarInitials}
        name={other.name}
        lastMessage={lastMessage}
        time={time}
        unreadCount={c.unreadCount}
        isPinned={isPinned}
        isSelected={c.id === selectedConversationId}
        onTogglePin={() => togglePin(c.id, isPinned)}
        onSelect={() => onSelectConversation(c.id)}
      />
    )
  })
}
