import { ASSISTANT_SENDER_ID } from '../messages/messages.constants';
import type { StoredMessage } from '../messages/messages.types';

export function latestQuestion(messages: StoredMessage[]): string | undefined {
  const questions = [...messages]
    .filter(
      (message) =>
        message.senderId !== ASSISTANT_SENDER_ID &&
        message.content.trim() !== '',
    )
    .sort(byOldestFirst);
  return questions[questions.length - 1]?.content;
}

function byOldestFirst(a: StoredMessage, b: StoredMessage): number {
  if (a.sentAt === b.sentAt) {
    return 0;
  }
  return a.sentAt < b.sentAt ? -1 : 1;
}
