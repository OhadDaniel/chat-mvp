import type { Conversation } from '../types'

export function applyTogglePin(
  conversations: Conversation[],
  id:            string,
  pinnedAt:      string | null,
): Conversation[] {
  return conversations.map(c =>
    c.id === id ? { ...c, pinnedAt } : c
  )
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
