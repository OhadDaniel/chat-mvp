import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { minutesAgo, SEED_MESSAGES } from '../../database/seed-data';
import { toUserProfile, type User } from '../users/users.types';
import type {
  CreateMessageResponse,
  GetMessagesResponse,
} from './messages.types';
import type { CreateMessageDto } from './dto/create-message.dto';
import type { GetMessagesQueryDto } from './dto/get-messages.query.dto';
import { MessagesRepository } from './messages.repository';

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

/**
 * Single-entity messages service: pagination + insert over its own
 * repository, nothing else. Authorization (the 403 participant rule)
 * is composed in front of these calls by the message orchestrators.
 *
 * Note what's MISSING vs week 3: no setLastMessage call after insert.
 * lastMessage is derived from this table — the invariant is gone.
 */
@Injectable()
export class MessagesService implements OnModuleInit {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoMessages();
  }

  async getPage(
    conversationId: string,
    query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponse> {
    // week-3 behavior preserved: silent cap at 50, unknown cursor = newest page
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const before = query.cursor
      ? await this.messagesRepository.findCursorPoint(
          conversationId,
          query.cursor,
        )
      : undefined;

    const { messages, hasMore } = await this.messagesRepository.findPageBefore(
      conversationId,
      before,
      limit,
    );

    return {
      messages,
      nextCursor: hasMore && messages.length > 0 ? messages[0].id : null,
    };
  }

  async create(
    conversationId: string,
    sender: User,
    dto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    const message = await this.messagesRepository.insert(
      randomUUID(),
      conversationId,
      toUserProfile(sender),
      dto.content,
    );

    return { message };
  }

  /** Same demo history as the week-3 seed store. Data lives in seed-data.ts. */
  private async seedDemoMessages(): Promise<void> {
    if ((await this.messagesRepository.count()) > 0) {
      return;
    }

    for (const seed of SEED_MESSAGES) {
      await this.messagesRepository.insertSeed(
        seed.id,
        seed.conversationId,
        seed.senderId,
        seed.content,
        minutesAgo(seed.minutesAgo),
      );
    }
  }
}
