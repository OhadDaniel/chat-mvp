import type { QueryFilter } from 'mongoose';
import type { MessageDocument } from './messages.schema';
import type { CursorPoint } from './messages.types';

export function buildPageFilter(
  conversationId: string,
  before: CursorPoint | undefined,
): QueryFilter<MessageDocument> {
  if (!before) {
    return { conversationId };
  }

  return {
    conversationId,
    $or: [
      { sentAt: { $lt: before.sentAt } },
      { sentAt: before.sentAt, _id: { $lt: before.id } },
    ],
  };
}
