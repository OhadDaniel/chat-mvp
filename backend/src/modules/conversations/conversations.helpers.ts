import { PipelineStage } from 'mongoose';
import { minutesAgo, SEED_MESSAGES } from '../mongo/seed-data';
import { USERS_COLLECTION } from '../users/users.schema';
import type { LastMessageSnapshot } from './conversations.types';

const PAIR_KEY_SEPARATOR = ':';

export function canonicalPair(userAId: string, userBId: string): string[] {
  return [userAId, userBId].sort();
}

export function buildPairKey(userAId: string, userBId: string): string {
  return canonicalPair(userAId, userBId).join(PAIR_KEY_SEPARATOR);
}

export function hydrateParticipantsStage(): PipelineStage.Lookup {
  return {
    $lookup: {
      from: USERS_COLLECTION,
      localField: 'participantIds',
      foreignField: '_id',
      as: 'participants',
      pipeline: [
        { $project: { _id: 1, firstName: 1, lastName: 1, avatarKey: 1 } },
      ],
    },
  };
}

function buildSearchRegex(search: string): RegExp {
  return new RegExp(escapeRegex(search), 'i');
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Match conversations where a participant's full name ("First Last")
 * matches the search term. Name isn't stored — it's the concatenation of
 * the hydrated firstName/lastName — so the comparison happens in the DB.
 */
export function participantNameSearchStage(search: string): PipelineStage.Match {
  const regex = buildSearchRegex(search);
  return {
    $match: {
      $expr: {
        $anyElementTrue: {
          $map: {
            input: '$participants',
            as: 'participant',
            in: {
              $regexMatch: {
                input: {
                  $trim: {
                    input: {
                      $concat: [
                        { $ifNull: ['$$participant.firstName', ''] },
                        ' ',
                        { $ifNull: ['$$participant.lastName', ''] },
                      ],
                    },
                  },
                },
                regex,
              },
            },
          },
        },
      },
    },
  };
}

export function buildSeedLastMessage(
  conversationId: string,
): LastMessageSnapshot | null {
  const messages = SEED_MESSAGES.filter(
    (message) => message.conversationId === conversationId,
  );
  if (messages.length === 0) {
    return null;
  }

  const newest = messages.reduce((latest, candidate) =>
    candidate.minutesAgo < latest.minutesAgo ? candidate : latest,
  );

  return {
    content: newest.content,
    sentAt: minutesAgo(newest.minutesAgo),
    senderId: newest.senderId,
  };
}
