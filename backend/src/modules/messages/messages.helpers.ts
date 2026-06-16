import { PipelineStage } from 'mongoose';
import { USERS_COLLECTION } from '../users/users.schema';
import type { CursorPoint } from './messages.types';

export function pageFilterStage(
  conversationId: string,
  before: CursorPoint | undefined,
): PipelineStage.Match {
  if (!before) {
    return { $match: { conversationId } };
  }

  return {
    $match: {
      conversationId,
      $or: [
        { sentAt: { $lt: before.sentAt } },
        { sentAt: before.sentAt, _id: { $lt: before.id } },
      ],
    },
  };
}

export function hydrateSenderStage(): PipelineStage.Lookup {
  return {
    $lookup: {
      from: USERS_COLLECTION,
      localField: 'senderId',
      foreignField: '_id',
      as: 'sender',
      pipeline: [
        { $project: { _id: 1, firstName: 1, lastName: 1, avatarKey: 1 } },
      ],
    },
  };
}
