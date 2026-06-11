/**
 * All SQL for the conversations store — named, in one place, data-free.
 *
 * CONVERSATION_SELECT is the shared read shape: joins users twice
 * (both pair columns point at the same table) and derives lastMessage
 * via LATERAL — "for each conversation, its single newest message".
 * LEFT join so conversations with no messages still come back.
 */

const CONVERSATION_SELECT = `
  SELECT c.id,
         c.pinned_at,
         c.created_at,
         ua.id AS a_id, ua.email AS a_email, ua.name AS a_name, ua.avatar_initials AS a_initials,
         ub.id AS b_id, ub.email AS b_email, ub.name AS b_name, ub.avatar_initials AS b_initials,
         lm.content   AS lm_content,
         lm.sent_at   AS lm_sent_at,
         lm.sender_id AS lm_sender_id
    FROM conversations c
    JOIN users ua ON ua.id = c.user_a_id
    JOIN users ub ON ub.id = c.user_b_id
    LEFT JOIN LATERAL (
      SELECT m.content, m.sent_at, m.sender_id
        FROM messages m
       WHERE m.conversation_id = c.id
       ORDER BY m.sent_at DESC, m.id DESC
       LIMIT 1
    ) lm ON true`;

const ORDER_BY_ACTIVITY = `
  ORDER BY lm.sent_at DESC NULLS LAST, c.created_at DESC`;

export const FIND_CONVERSATIONS_BY_USER = `${CONVERSATION_SELECT}
   WHERE (c.user_a_id = $1 OR c.user_b_id = $1)
  ${ORDER_BY_ACTIVITY}`;

export const SEARCH_CONVERSATIONS_BY_NAME = `${CONVERSATION_SELECT}
   WHERE (c.user_a_id = $1 OR c.user_b_id = $1)
     AND (ua.name ILIKE $2 OR ub.name ILIKE $2)
  ${ORDER_BY_ACTIVITY}`;

export const FIND_CONVERSATION_BY_ID = `${CONVERSATION_SELECT}
   WHERE c.id = $1`;

export const PAIR_EXISTS = `
  SELECT EXISTS(
    SELECT 1 FROM conversations
     WHERE user_a_id = $1 AND user_b_id = $2
  ) AS exists`;

export const INSERT_CONVERSATION = `
  INSERT INTO conversations (id, user_a_id, user_b_id, pinned_at)
  VALUES ($1, $2, $3, $4)`;

export const SET_PINNED = `
  UPDATE conversations
     SET pinned_at = CASE WHEN $2 THEN now() ELSE NULL END
   WHERE id = $1`;

export const COUNT_CONVERSATIONS = `SELECT count(*) AS count FROM conversations`;
