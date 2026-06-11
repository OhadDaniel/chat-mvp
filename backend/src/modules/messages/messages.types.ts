import type { PublicUser } from '../users/users.types';

/** All types for the messages module, in one place. */

/* ── Domain (API shape — frozen since week 3) ───────────── */

export type Message = {
  id: string;
  conversationId: string;
  sender: PublicUser;
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

/* ── Storage rows (snake_case, produced by MESSAGE_SELECT) ──
   Only the repository should import these. */

export type MessageRow = {
  id: string;
  conversation_id: string;
  content: string;
  sent_at: Date;
  status: string;
  s_id: string;
  s_email: string;
  s_name: string;
  s_initials: string;
};
