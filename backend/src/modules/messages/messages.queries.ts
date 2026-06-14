/**
 * All SQL for the messages store — named, in one place, data-free.
 * Two page queries instead of one string-built query: with and
 * without a cursor. Both fetch newest-first; the repo reverses.
 */

const MESSAGE_SELECT = `
  SELECT m.id, m.conversation_id, m.content, m.sent_at, m.status,
         u.id AS s_id, u.name AS s_name, u.avatar_initials AS s_initials
    FROM messages m
    JOIN users u ON u.id = m.sender_id`;

export const FIND_CURSOR_POINT = `
  SELECT id, sent_at
    FROM messages
   WHERE id = $1 AND conversation_id = $2`;

export const FIND_NEWEST_PAGE = `${MESSAGE_SELECT}
   WHERE m.conversation_id = $1
   ORDER BY m.sent_at DESC, m.id DESC
   LIMIT $2`;

export const FIND_PAGE_BEFORE_CURSOR = `${MESSAGE_SELECT}
   WHERE m.conversation_id = $1
     AND (m.sent_at, m.id) < ($2, $3)
   ORDER BY m.sent_at DESC, m.id DESC
   LIMIT $4`;

export const INSERT_MESSAGE = `
  INSERT INTO messages (id, conversation_id, sender_id, content)
  VALUES ($1, $2, $3, $4)
  RETURNING sent_at, status`;

export const INSERT_SEED_MESSAGE = `
  INSERT INTO messages (id, conversation_id, sender_id, content, sent_at)
  VALUES ($1, $2, $3, $4, $5)`;

export const COUNT_MESSAGES = `SELECT count(*) AS count FROM messages`;
