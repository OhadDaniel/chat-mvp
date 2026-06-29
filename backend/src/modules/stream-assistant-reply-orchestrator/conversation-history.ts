import { ASSISTANT_SENDER_ID } from '../messages/messages.constants';
import type { StoredMessage } from '../messages/messages.types';
import type { ProviderMessage } from '../ai-assistant/llm-abstraction/llm.types';

export const HISTORY_LIMIT = 20;

export function buildHistory(messages: StoredMessage[]): ProviderMessage[] {
  return [...messages]
    .filter((message) => message.content && message.content.trim() !== '')
    .sort(byOldestFirst)
    .slice(-HISTORY_LIMIT)
    .map(toProviderMessage);
}

function byOldestFirst(a: StoredMessage, b: StoredMessage): number {
  if (a.sentAt !== b.sentAt) {
    return a.sentAt < b.sentAt ? -1 : 1;
  }
  if (a.id === b.id) {
    return 0;
  }
  return a.id < b.id ? -1 : 1;
}

function toProviderMessage(message: StoredMessage): ProviderMessage {
  if (message.senderId === ASSISTANT_SENDER_ID) {
    return { role: 'assistant', content: message.content };
  }
  return { role: 'user', content: message.content };
}
