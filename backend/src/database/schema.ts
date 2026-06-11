/**
 * Database schema, applied idempotently at boot (CREATE ... IF NOT EXISTS).
 * Kept as a TS constant (not a .sql asset) so the compiled dist/ is
 * self-contained. Real migrations come when the schema starts evolving.
 *
 * Invariants enforced BY THE DATABASE (not by politeness):
 * - users.email unique                      → duplicate signup impossible
 * - conversation: exactly 2 distinct users  → pair columns + CHECK
 * - one conversation per pair               → UNIQUE (user_a_id, user_b_id)
 *   (user_a_id < user_b_id gives each pair ONE canonical form,
 *    so (alice,ben) and (ben,alice) cannot both exist)
 * - message must belong to a conversation   → NOT NULL FK
 * - message must have a sender              → NOT NULL FK
 *
 * Enforced in service code instead: "sender is a participant" (the 403 rule).
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  avatar_initials TEXT NOT NULL,
  password_hash   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT PRIMARY KEY,
  user_a_id  TEXT NOT NULL REFERENCES users(id),
  user_b_id  TEXT NOT NULL REFERENCES users(id),
  pinned_at  TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (user_a_id < user_b_id),
  UNIQUE (user_a_id, user_b_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       TEXT NOT NULL REFERENCES users(id),
  content         TEXT NOT NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  status          TEXT NOT NULL DEFAULT 'sent'
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_a ON conversations (user_a_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_b ON conversations (user_b_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sent
  ON messages (conversation_id, sent_at, id);
`
