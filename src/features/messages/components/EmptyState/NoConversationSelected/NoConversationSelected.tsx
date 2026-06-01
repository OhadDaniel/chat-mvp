import { EmptyState } from '../EmptyState'

const NO_CONVERSATION_MESSAGE = 'Select a conversation to start chatting'

export function NoConversationSelected() {
  return <EmptyState message={NO_CONVERSATION_MESSAGE} />
}
