import { minutesAgo, SEED_MESSAGES } from '../mongo/seed-data';
import type { UserProfile } from '../users/users.types';
import type {
  LastMessageSnapshot,
  ParticipantSnapshot,
} from './conversations.types';

const PAIR_KEY_SEPARATOR = ':';

export function canonicalPair(userAId: string, userBId: string): string[] {
  return [userAId, userBId].sort();
}

export function buildPairKey(userAId: string, userBId: string): string {
  return canonicalPair(userAId, userBId).join(PAIR_KEY_SEPARATOR);
}

export function toParticipantSnapshot(profile: UserProfile): ParticipantSnapshot {
  return {
    userId: profile.id,
    name: profile.name,
    avatarInitials: profile.avatarInitials,
    avatarUrl: profile.avatarUrl,
  };
}

/** Store the pair in a stable order so reads are deterministic. */
export function orderParticipants(
  a: ParticipantSnapshot,
  b: ParticipantSnapshot,
): ParticipantSnapshot[] {
  return [a, b].sort((x, y) => (x.userId < y.userId ? -1 : 1));
}

export function buildNameSearchRegex(search: string): RegExp {
  return new RegExp(escapeRegex(search), 'i');
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
