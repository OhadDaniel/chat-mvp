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

/* ── Storage rows (snake_case, produced by CONVERSATION_SELECT) ──
   Only the repository should import these. */

export type ConversationRow = {
  id: string;
  pinned_at: Date | null;
  created_at: Date;
  a_id: string;
  a_name: string;
  a_initials: string;
  b_id: string;
  b_name: string;
  b_initials: string;
  lm_content: string | null;
  lm_sent_at: Date | null;
  lm_sender_id: string | null;
};
