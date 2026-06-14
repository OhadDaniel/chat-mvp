import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../database/database.constants';
import {
  COUNT_CONVERSATIONS,
  FIND_CONVERSATION_BY_ID,
  FIND_CONVERSATIONS_BY_USER,
  FIND_PARTICIPANT_IDS,
  INSERT_CONVERSATION,
  PAIR_EXISTS,
  SEARCH_CONVERSATIONS_BY_NAME,
  SET_PINNED,
} from './conversations.queries';
import type { Conversation, ConversationRow } from './conversations.types';

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
          `%${escapeLikePattern(search)}%`,
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

  /** Authorization-only read: the participant pair for a conversation, or undefined. */
  async findParticipantIds(
    id: string,
  ): Promise<{ userAId: string; userBId: string } | undefined> {
    const result = await this.pool.query<{
      user_a_id: string;
      user_b_id: string;
    }>(FIND_PARTICIPANT_IDS, [id]);
    const row = result.rows[0];
    return row && { userAId: row.user_a_id, userBId: row.user_b_id };
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

/**
 * Treat user input as a literal in ILIKE: escape the pattern
 * metacharacters % and _ (and the escape char \ itself) so a typed
 * "_" matches an underscore, not "any character". Postgres LIKE/ILIKE
 * uses backslash as the default escape, so no ESCAPE clause is needed.
 */
function escapeLikePattern(input: string): string {
  return input.replace(/[\\%_]/g, (char) => `\\${char}`);
}

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
        name: row.a_name,
        avatarInitials: row.a_initials,
      },
      {
        id: row.b_id,
        name: row.b_name,
        avatarInitials: row.b_initials,
      },
    ],
    lastMessage,
    lastMessageAt: lastMessage?.sentAt ?? null,
    pinnedAt: row.pinned_at?.toISOString() ?? null,
  };
}
