import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
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

@Injectable()
export class MessagesService implements OnModuleInit {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly conversationsService: ConversationsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoMessages();
  }

  async getPage(
    conversationId: string,
    userId: string,
    query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponse> {
    // 404 if missing, 403 if not a participant — before reading anything
    await this.conversationsService.getForParticipant(conversationId, userId);

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
    // same gate as reads: participants only (403), conversation must exist (404)
    await this.conversationsService.getForParticipant(
      conversationId,
      sender.id,
    );

    const message = await this.messagesRepository.insert(
      randomUUID(),
      conversationId,
      toUserProfile(sender),
      dto.content,
    );

    return { message };
  }

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
