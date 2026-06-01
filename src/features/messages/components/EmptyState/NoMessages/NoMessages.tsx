import { EmptyState } from '../EmptyState'

const NO_MESSAGES_MESSAGE = 'No messages yet. Say hello!'

export function NoMessages() {
  return <EmptyState message={NO_MESSAGES_MESSAGE} />
}
