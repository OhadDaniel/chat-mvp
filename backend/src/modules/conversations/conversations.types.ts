import type { Avatar, UserProfile } from '../users/users.types';

/** All types for the conversations module, in one place. */

/* ── Domain (API shape — frozen since week 3) ───────────── */

export type LastMessage = {
  content: string;
  sentAt: string;
  senderId: string;
};

/**
 * A conversation is a discriminated union on `type`. The shared fields are the
 * same for both kinds; only the variant-specific fields differ — so a DM can
 * never carry a title and a group can never carry a pairKey.
 */
type ConversationBase = {
  id: string;
  participants: UserProfile[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};

export type DirectConversation = ConversationBase & { type: 'direct' };

export type GroupConversation = ConversationBase & {
  type: 'group';
  name: string;
  createdBy: string;
  avatarUrl: string | null;
};

export type Conversation = DirectConversation | GroupConversation;

/* ── API response envelopes ─────────────────────────────── */

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export type CreateConversationResponse = {
  conversation: Conversation;
};

export type PatchConversationResponse = {
  conversation: Conversation;
};

/* ── Stored shape (participants by reference — joined on read) ── */

type StoredConversationBase = {
  id: string;
  participantIds: string[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};

export type StoredDirectConversation = StoredConversationBase & {
  type: 'direct';
};

export type StoredGroupConversation = StoredConversationBase & {
  type: 'group';
  name: string;
  createdBy: string;
  avatar: Avatar | null;
};

export type StoredConversation =
  | StoredDirectConversation
  | StoredGroupConversation;

/** Written onto a conversation when a message is sent. */
export type LastMessageSnapshot = {
  content: string;
  sentAt: Date;
  senderId: string;
};
