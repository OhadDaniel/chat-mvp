import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';
import type { Conversation } from './entities/conversation.entity';

/**
 * SQL store for conversations. Note what is NOT here: no lastMessage
 * column anywhere — it is DERIVED from the messages table on every
 * read (LATERAL subquery picks the newest message per conversation).
 * Derived data cannot go stale, so the week-3 "update lastMessage on
 * send" invariant simply no longer exists.
 */
@Injectable()
export class ConversationsRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  /**
   * Shared SELECT: joins both participants and attaches the latest
   * message (if any). Every read goes through this one shape.
   */
  private readonly baseSelect = `
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

  async findAllByUserId(
    userId: string,
    search?: string,
  ): Promise<Conversation[]> {
    const params: unknown[] = [userId];
    let sql = `${this.baseSelect}
     WHERE (c.user_a_id = $1 OR c.user_b_id = $1)`;

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (ua.name ILIKE $2 OR ub.name ILIKE $2)`;
    }

    sql += ` ORDER BY lm.sent_at DESC NULLS LAST, c.created_at DESC`;

    const result = await this.pool.query<ConversationRow>(sql, params);
    return result.rows.map(rowToConversation);
  }

  async findById(id: string): Promise<Conversation | undefined> {
    const result = await this.pool.query<ConversationRow>(
      `${this.baseSelect} WHERE c.id = $1`,
      [id],
    );
    return result.rows[0] && rowToConversation(result.rows[0]);
  }

  /** Pair lookup — callers must pass the canonical order (a < b). */
  async existsByPair(userAId: string, userBId: string): Promise<boolean> {
    const result = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS(
         SELECT 1 FROM conversations
          WHERE user_a_id = $1 AND user_b_id = $2
       ) AS exists`,
      [userAId, userBId],
    );
    return result.rows[0]?.exists ?? false;
  }

  async insert(
    id: string,
    userAId: string,
    userBId: string,
    pinnedAt: Date | null = null,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO conversations (id, user_a_id, user_b_id, pinned_at)
       VALUES ($1, $2, $3, $4)`,
      [id, userAId, userBId, pinnedAt],
    );
  }

  async setPinned(id: string, pinned: boolean): Promise<void> {
    await this.pool.query(
      `UPDATE conversations
          SET pinned_at = CASE WHEN $2 THEN now() ELSE NULL END
        WHERE id = $1`,
      [id, pinned],
    );
  }

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT count(*) AS count FROM conversations',
    );
    return Number(result.rows[0]?.count ?? 0);
  }
}

type ConversationRow = {
  id: string;
  pinned_at: Date | null;
  created_at: Date;
  a_id: string;
  a_email: string;
  a_name: string;
  a_initials: string;
  b_id: string;
  b_email: string;
  b_name: string;
  b_initials: string;
  lm_content: string | null;
  lm_sent_at: Date | null;
  lm_sender_id: string | null;
};

function rowToConversation(row: ConversationRow): Conversation {
  const lastMessage =
    row.lm_content !== null &&
    row.lm_sent_at !== null &&
    row.lm_sender_id !== null
      ? {
          content: row.lm_content,
          sentAt: row.lm_sent_at.toISOString(),
          senderId: row.lm_sender_id,
        }
      : null;

  return {
    id: row.id,
    participants: [
      {
        id: row.a_id,
        email: row.a_email,
        name: row.a_name,
        avatarInitials: row.a_initials,
      },
      {
        id: row.b_id,
        email: row.b_email,
        name: row.b_name,
        avatarInitials: row.b_initials,
      },
    ],
    lastMessage,
    lastMessageAt: lastMessage?.sentAt ?? null,
    pinnedAt: row.pinned_at?.toISOString() ?? null,
  };
}
