import { ASSISTANT_AVATAR_URL } from '@/shared/constants'
import type { Conversation, ConversationDisplay } from '../types'
import { ASSISTANT_DISPLAY_TITLE, ASSISTANT_DISPLAY_INITIALS } from '../constants'

export function getConversationDisplay(
  conversation: Conversation,
  currentUserId: string,
): ConversationDisplay {
  if (conversation.type === 'group') {
    return {
      title:     conversation.name,
      avatarUrl: conversation.avatarUrl,
      initials:  '',
      isGroup:   true,
    }
  }

  if (conversation.type === 'assistant') {
    return {
      title:     ASSISTANT_DISPLAY_TITLE,
      avatarUrl: ASSISTANT_AVATAR_URL,
      initials:  ASSISTANT_DISPLAY_INITIALS,
      isGroup:   false,
    }
  }

  const other =
    conversation.participants.find(p => p.id !== currentUserId) ??
    conversation.participants[0]

  return {
    title:     other.name,
    avatarUrl: other.avatarUrl,
    initials:  other.avatarInitials,
    isGroup:   false,
  }
}

export function applyTogglePin(
  conversations: Conversation[],
  id:            string,
  pinnedAt:      string | null,
): Conversation[] {
  return conversations.map(c =>
    c.id === id ? { ...c, pinnedAt } : c
  )
}

export function applyConversationUpdate(
  conversations: Conversation[],
  updated:       Conversation,
): Conversation[] {
  return conversations.map(c => (c.id === updated.id ? updated : c))
}

export function sortConversations(conversations: Conversation[]): Conversation[] {
  const pinned = conversations
    .filter(c => c.pinnedAt !== null)
    .sort((a, b) => new Date(b.pinnedAt!).getTime() - new Date(a.pinnedAt!).getTime())

  const unpinned = conversations
    .filter(c => c.pinnedAt === null)
    .sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
      return bTime - aTime
    })

  return [...pinned, ...unpinned]
}
