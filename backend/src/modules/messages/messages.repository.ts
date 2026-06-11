import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/database.constants';
import type { PublicUser } from '../users/users.types';
import {
  COUNT_MESSAGES,
  FIND_CURSOR_POINT,
  FIND_NEWEST_PAGE,
  FIND_PAGE_BEFORE_CURSOR,
  INSERT_MESSAGE,
  INSERT_SEED_MESSAGE,
} from './messages.queries';
import type {
  CursorPoint,
  Message,
  MessagePage,
  MessageRow,
} from './messages.types';

/**
 * Postgres store for messages. SQL lives in messages.queries.ts;
 * this class only runs it and maps rows. Pagination happens IN the
 * query (keyset) — never reads more than one page.
 * NOT exported from MessagesModule.
 */
@Injectable()
export class MessagesRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  /** Resolve a cursor (message id) to its position in the timeline. */
  async findCursorPoint(
    conversationId: string,
    messageId: string,
  ): Promise<CursorPoint | undefined> {
    const result = await this.pool.query<{ id: string; sent_at: Date }>(
      FIND_CURSOR_POINT,
      [messageId, conversationId],
    );
    const row = result.rows[0];
    return row && { id: row.id, sentAt: row.sent_at };
  }

 
  async findPageBefore(
    conversationId: string,
    before: CursorPoint | undefined,
    limit: number,
  ): Promise<MessagePage> {
    const result = before
      ? await this.pool.query<MessageRow>(FIND_PAGE_BEFORE_CURSOR, [
          conversationId,
          before.sentAt,
          before.id,
          limit + 1,
        ])
      : await this.pool.query<MessageRow>(FIND_NEWEST_PAGE, [
          conversationId,
          limit + 1,
        ]);

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
      INSERT_MESSAGE,
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
    await this.pool.query(INSERT_SEED_MESSAGE, [
      id,
      conversationId,
      senderId,
      content,
      sentAt,
    ]);
  }

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(COUNT_MESSAGES);
    return Number(result.rows[0]?.count ?? 0);
  }
}

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
