import type { UserProfile } from '../users/users.types';

/** All types for the conversations module, in one place. */

/* ── Domain (API shape — frozen since week 3) ───────────── */

export type LastMessage = {
  content: string;
  sentAt: string;
  senderId: string;
};

export type Conversation = {
  id: string;
  participants: UserProfile[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};

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

/* ── Storage snapshots (written onto a conversation) ────── */

export type LastMessageSnapshot = {
  content: string;
  sentAt: Date;
  senderId: string;
};

/** A participant's display data, denormalized onto the conversation. */
export type ParticipantSnapshot = {
  userId: string;
  name: string;
  avatarInitials: string;
  avatarUrl: string | null;
};
