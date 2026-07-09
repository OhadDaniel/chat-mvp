import type { Conversation } from '@/features/conversations/types/index'

export type TogglePin = (id: string, currentlyPinned: boolean) => Promise<void>

export type ConversationItemContainerProps = {
  conversation: Conversation
}
