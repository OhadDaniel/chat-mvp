import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';
import type { PublicUser } from '../users/entities/user.entity';
import type { Message } from './entities/message.entity';

/** A point in the message timeline — used for keyset pagination. */
export type CursorPoint = {
  sentAt: Date;
  id: string;
};

export type MessagePage = {
  messages: Message[];
  hasMore: boolean;
};

/**
 * SQL store for messages. Pagination happens IN the query (keyset:
 * "rows strictly older than the cursor, newest first, LIMIT n") —
 * the week-3 version loaded everything and sliced in JS; this never
 * reads more than one page.
 */
@Injectable()
export class MessagesRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  private readonly baseSelect = `
    SELECT m.id, m.conversation_id, m.content, m.sent_at, m.status,
           u.id AS s_id, u.email AS s_email, u.name AS s_name, u.avatar_initials AS s_initials
      FROM messages m
      JOIN users u ON u.id = m.sender_id`;

  /** Resolve a cursor (message id) to its position in the timeline. */
  async findCursorPoint(
    conversationId: string,
    messageId: string,
  ): Promise<CursorPoint | undefined> {
    const result = await this.pool.query<{ id: string; sent_at: Date }>(
      `SELECT id, sent_at FROM messages
        WHERE id = $1 AND conversation_id = $2`,
      [messageId, conversationId],
    );
    const row = result.rows[0];
    return row && { id: row.id, sentAt: row.sent_at };
  }

  /**
   * Chat-style page: the `limit` newest messages older than `before`
   * (or the newest overall when no cursor). Fetches limit+1 to learn
   * whether more history exists, returns the page in ascending order.
   */
  async findPageBefore(
    conversationId: string,
    before: CursorPoint | undefined,
    limit: number,
  ): Promise<MessagePage> {
    const params: unknown[] = [conversationId];
    let sql = `${this.baseSelect} WHERE m.conversation_id = $1`;

    if (before) {
      params.push(before.sentAt, before.id);
      sql += ` AND (m.sent_at, m.id) < ($2, $3)`;
    }

    params.push(limit + 1);
    sql += ` ORDER BY m.sent_at DESC, m.id DESC LIMIT $${params.length}`;

    const result = await this.pool.query<MessageRow>(sql, params);
    const hasMore = result.rows.length > limit;
    const page = result.rows.slice(0, limit).reverse(); // back to ascending

    return { messages: page.map(rowToMessage), hasMore };
  }

  async insert(
    id: string,
    conversationId: string,
    sender: PublicUser,
    content: string,
  ): Promise<Message> {
    const result = await this.pool.query<{ sent_at: Date; status: string }>(
      `INSERT INTO messages (id, conversation_id, sender_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING sent_at, status`,
      [id, conversationId, sender.id, content],
    );

    const row = result.rows[0];
    return {
      id,
      conversationId,
      sender,
      content,
      sentAt: row.sent_at.toISOString(),
      status: 'sent',
    };
  }

  /** Seed-only: explicit id and sent_at so demo history is stable. */
  async insertSeed(
    id: string,
    conversationId: string,
    senderId: string,
    content: string,
    sentAt: Date,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO messages (id, conversation_id, sender_id, content, sent_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, conversationId, senderId, content, sentAt],
    );
  }

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT count(*) AS count FROM messages',
    );
    return Number(result.rows[0]?.count ?? 0);
  }
}

type MessageRow = {
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

function rowToMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    sender: {
      id: row.s_id,
      email: row.s_email,
      name: row.s_name,
      avatarInitials: row.s_initials,
    },
    content: row.content,
    sentAt: row.sent_at.toISOString(),
    status: 'sent',
  };
}
