import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppException } from '../../common/errors/app.exception';
import { isUniqueViolation } from '../../database/pg-errors';
import { daysAgo, SEED_CONVERSATIONS } from '../../database/seed-data';
import type { User } from '../users/users.types';
import { UsersService } from '../users/users.service';
import { ConversationsRepository } from './conversations.repository';
import type {
  Conversation,
  CreateConversationResponse,
  GetConversationsResponse,
  PatchConversationResponse,
} from './conversations.types';
import type { CreateConversationDto } from './dto/create-conversation.dto';
import type { PatchConversationDto } from './dto/patch-conversation.dto';

@Injectable()
export class ConversationsService implements OnModuleInit {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoConversations();
  }

  async list(
    userId: string,
    search?: string,
  ): Promise<GetConversationsResponse> {
    const conversations = await this.conversationsRepository.findAllByUserId(
      userId,
      search,
    );
    return { conversations };
  }

  async create(
    currentUser: User,
    dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    if (dto.participantId === currentUser.id) {
      throw new AppException(
        400,
        'INVALID_PARTICIPANT',
        'Cannot start a conversation with yourself',
      );
    }

    const participant = await this.usersService.findById(dto.participantId);
    if (!participant) {
      throw new AppException(404, 'USER_NOT_FOUND', 'Participant not found');
    }

    const [userAId, userBId] = [currentUser.id, participant.id].sort();

    if (await this.conversationsRepository.existsByPair(userAId, userBId)) {
      throw new AppException(
        409,
        'CONVERSATION_ALREADY_EXISTS',
        'A conversation with this user already exists',
      );
    }

    const id = randomUUID();
    try {
      await this.conversationsRepository.insert(id, userAId, userBId);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppException(
          409,
          'CONVERSATION_ALREADY_EXISTS',
          'A conversation with this user already exists',
        );
      }
      throw error;
    }

    const conversation = await this.getByIdOrThrow(id);
    return { conversation };
  }

  async setPinned(
    conversationId: string,
    userId: string,
    dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    // Gate on the participant pair only — no need to hydrate the whole
    // conversation just to authorize.
    await this.assertParticipant(conversationId, userId);
    await this.conversationsRepository.setPinned(conversationId, dto.pinned);

    const conversation = await this.getByIdOrThrow(conversationId);
    return { conversation };
  }

  private async assertParticipant(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const pair =
      await this.conversationsRepository.findParticipantIds(conversationId);
    if (!pair) {
      throw new AppException(
        404,
        'CONVERSATION_NOT_FOUND',
        'Conversation not found',
      );
    }
    if (pair.userAId !== userId && pair.userBId !== userId) {
      throw new AppException(
        403,
        'NOT_A_PARTICIPANT',
        'You are not a participant of this conversation',
      );
    }
  }

  async getForParticipant(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.getByIdOrThrow(conversationId);

    const isParticipant = conversation.participants.some(
      (participant) => participant.id === userId,
    );
    if (!isParticipant) {
      throw new AppException(
        403,
        'NOT_A_PARTICIPANT',
        'You are not a participant of this conversation',
      );
    }

    return conversation;
  }

  private async getByIdOrThrow(id: string): Promise<Conversation> {
    const conversation = await this.conversationsRepository.findById(id);
    if (!conversation) {
      throw new AppException(
        404,
        'CONVERSATION_NOT_FOUND',
        'Conversation not found',
      );
    }
    return conversation;
  }

  private async seedDemoConversations(): Promise<void> {
    if ((await this.conversationsRepository.count()) > 0) {
      return;
    }

    for (const seed of SEED_CONVERSATIONS) {
      await this.conversationsRepository.insert(
        seed.id,
        seed.userAId,
        seed.userBId,
        seed.pinnedDaysAgo !== undefined ? daysAgo(seed.pinnedDaysAgo) : null,
      );
    }
  }
}
