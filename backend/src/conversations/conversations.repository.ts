import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';
import {
  COUNT_CONVERSATIONS,
  FIND_CONVERSATION_BY_ID,
  FIND_CONVERSATIONS_BY_USER,
  INSERT_CONVERSATION,
  PAIR_EXISTS,
  SEARCH_CONVERSATIONS_BY_NAME,
  SET_PINNED,
} from './conversations.queries';
import type { Conversation } from './entities/conversation.entity';

/**
 * Postgres store for conversations. SQL lives in
 * conversations.queries.ts; this class only runs it and maps rows.
 * Note: no lastMessage column anywhere — it is DERIVED from the
 * messages table on every read, so it can never go stale.
 * NOT exported from ConversationsModule.
 */
@Injectable()
export class ConversationsRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAllByUserId(
    userId: string,
    search?: string,
  ): Promise<Conversation[]> {
    const result = search
      ? await this.pool.query<ConversationRow>(SEARCH_CONVERSATIONS_BY_NAME, [
          userId,
          `%${search}%`,
        ])
      : await this.pool.query<ConversationRow>(FIND_CONVERSATIONS_BY_USER, [
          userId,
        ]);

    return result.rows.map(rowToConversation);
  }

  async findById(id: string): Promise<Conversation | undefined> {
    const result = await this.pool.query<ConversationRow>(
      FIND_CONVERSATION_BY_ID,
      [id],
    );
    return result.rows[0] && rowToConversation(result.rows[0]);
  }

  /** Pair lookup — callers must pass the canonical order (a < b). */
  async existsByPair(userAId: string, userBId: string): Promise<boolean> {
    const result = await this.pool.query<{ exists: boolean }>(PAIR_EXISTS, [
      userAId,
      userBId,
    ]);
    return result.rows[0]?.exists ?? false;
  }

  async insert(
    id: string,
    userAId: string,
    userBId: string,
    pinnedAt: Date | null = null,
  ): Promise<void> {
    await this.pool.query(INSERT_CONVERSATION, [
      id,
      userAId,
      userBId,
      pinnedAt,
    ]);
  }

  async setPinned(id: string, pinned: boolean): Promise<void> {
    await this.pool.query(SET_PINNED, [id, pinned]);
  }

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      COUNT_CONVERSATIONS,
    );
    return Number(result.rows[0]?.count ?? 0);
  }
}

/** Raw row shape produced by CONVERSATION_SELECT. */
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
