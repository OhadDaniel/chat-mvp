import type { UserProfile } from '../users/users.types';

/** All types for the messages module, in one place. */

/* ── Domain (API shape — frozen since week 3) ───────────── */

export type Message = {
  id: string;
  conversationId: string;
  sender: UserProfile;
  content: string;
  sentAt: string;
  status: 'sent';
};

/* ── API response envelopes ─────────────────────────────── */

export type GetMessagesResponse = {
  messages: Message[];
  nextCursor: string | null;
};

export type CreateMessageResponse = {
  message: Message;
};

/* ── Pagination ─────────────────────────────────────────── */

/** A point in the message timeline — used for keyset pagination. */
export type CursorPoint = {
  sentAt: Date;
  id: string;
};

export type MessagePage = {
  messages: Message[];
  hasMore: boolean;
};
