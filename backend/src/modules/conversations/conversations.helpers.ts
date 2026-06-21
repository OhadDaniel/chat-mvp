import { minutesAgo, SEED_MESSAGES } from '../mongo/seed-data';
import { mapToUserProfile, type User, type UserProfile } from '../users/users.types';
import type {
  Conversation,
  LastMessageSnapshot,
  StoredConversation,
} from './conversations.types';

const PAIR_KEY_SEPARATOR = ':';

export function canonicalPair(userAId: string, userBId: string): string[] {
  return [userAId, userBId].sort();
}

export function buildPairKey(userAId: string, userBId: string): string {
  return canonicalPair(userAId, userBId).join(PAIR_KEY_SEPARATOR);
}

/** Index the fetched participants by id, as public profiles, for the join. */
export function profilesById(users: User[]): Map<string, UserProfile> {
  return new Map(users.map((user) => [user.id, mapToUserProfile(user)]));
}

/** Assemble the API conversation by joining the stored ids with current profiles. */
export function toConversation(
  stored: StoredConversation,
  profiles: Map<string, UserProfile>,
): Conversation {
  const base = {
    id: stored.id,
    participants: stored.participantIds.map(
      (id) =>
        profiles.get(id) ?? { id, name: '', avatarInitials: '', avatarUrl: null },
    ),
    lastMessage: stored.lastMessage,
    lastMessageAt: stored.lastMessageAt,
    pinnedAt: stored.pinnedAt,
  };

  if (stored.type === 'group') {
    return {
      ...base,
      type: 'group',
      name: stored.name,
      createdBy: stored.createdBy,
      avatarUrl: stored.avatar?.srcUrl ?? null,
    };
  }

  return { ...base, type: 'direct' };
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
