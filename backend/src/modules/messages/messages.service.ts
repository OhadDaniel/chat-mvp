import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientSession } from 'mongoose';
import { minutesAgo, SEED_MESSAGES } from '../mongo/seed-data';
import { mapToUserProfile, type User, type UserProfile } from '../users/users.types';
import { MESSAGE_STATUS_SENT } from './messages.schema';
import type { Message, MessagePage, StoredMessage } from './messages.types';
import type { CreateMessageDto } from './dto/create-message.request.dto';
import type { GetMessagesQueryDto } from './dto/get-messages.query.dto';
import { MessagesRepository } from './messages.repository';

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

@Injectable()
export class MessagesService implements OnModuleInit {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoMessages();
  }

  async getPage(
    conversationId: string,
    query: GetMessagesQueryDto,
    participants: UserProfile[],
  ): Promise<MessagePage> {
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

    const senderById = new Map(participants.map((p) => [p.id, p]));
    const items = messages.map((stored) => toMessage(stored, senderById));

    return {
      items,
      nextCursor: hasMore && items.length > 0 ? items[0].id : null,
    };
  }

  async create(
    conversationId: string,
    sender: User,
    dto: CreateMessageDto,
    session?: ClientSession,
  ): Promise<Message> {
    return this.messagesRepository.insert(
      randomUUID(),
      conversationId,
      mapToUserProfile(sender),
      dto.content,
      session,
    );
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

/** Resolve a stored message's sender from the conversation's participants. */
function toMessage(
  stored: StoredMessage,
  senderById: Map<string, UserProfile>,
): Message {
  const sender = senderById.get(stored.senderId) ?? {
    id: stored.senderId,
    name: '',
    avatarInitials: '',
    avatarUrl: null,
  };
  return {
    id: stored.id,
    conversationId: stored.conversationId,
    sender,
    content: stored.content,
    sentAt: stored.sentAt,
    status: MESSAGE_STATUS_SENT,
  };
}
