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

/* ── Stored shape (participants by reference — joined on read) ── */

export type StoredConversation = {
  id: string;
  participantIds: string[];
  lastMessage: LastMessage | null;
  lastMessageAt: string | null;
  pinnedAt: string | null;
};

/** Written onto a conversation when a message is sent. */
export type LastMessageSnapshot = {
  content: string;
  sentAt: Date;
  senderId: string;
};
