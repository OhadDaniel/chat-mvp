import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientSession } from 'mongoose';
import { AppException } from '../../common/errors/app.exception';
import { isDuplicateKeyError } from '../mongo/mongo-errors';
import { daysAgo, SEED_CONVERSATIONS } from '../mongo/seed-data';
import {
  buildPairKey,
  buildSeedLastMessage,
  canonicalPair,
} from './conversations.helpers';
import { ConversationsRepository } from './conversations.repository';
import type {
  LastMessageSnapshot,
  StoredConversation,
} from './conversations.types';
import type { PatchConversationDto } from './dto/patch-conversation.dto';

/**
 * Owns the conversations domain: the pair rules (distinct users, one
 * conversation per pair), pinning, and the participant authorization rule.
 * It deals in participant *ids only* — joining in the current user profiles
 * is the orchestrators' job.
 */
@Injectable()
export class ConversationsService implements OnModuleInit {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDemoConversations();
  }

  list(userId: string): Promise<StoredConversation[]> {
    return this.conversationsRepository.findAllByUserId(userId);
  }

  async create(
    currentUserId: string,
    participantId: string,
  ): Promise<StoredConversation> {
    if (participantId === currentUserId) {
      throw new AppException(
        400,
        'INVALID_PARTICIPANT',
        'Cannot start a conversation with yourself',
      );
    }

    const pairKey = buildPairKey(currentUserId, participantId);
    if (await this.conversationsRepository.existsByPair(pairKey)) {
      throw new AppException(
        409,
        'CONVERSATION_ALREADY_EXISTS',
        'A conversation with this user already exists',
      );
    }

    const id = randomUUID();
    try {
      await this.conversationsRepository.insert(
        id,
        canonicalPair(currentUserId, participantId),
        pairKey,
      );
    } catch (error) {
      // race-proof backstop: two simultaneous creates -> DB constraint
      if (isDuplicateKeyError(error)) {
        throw new AppException(
          409,
          'CONVERSATION_ALREADY_EXISTS',
          'A conversation with this user already exists',
        );
      }
      throw error;
    }

    return this.getByIdOrThrow(id);
  }

  async setPinned(
    conversationId: string,
    userId: string,
    dto: PatchConversationDto,
  ): Promise<StoredConversation> {
    await this.assertParticipant(conversationId, userId);
    await this.conversationsRepository.setPinned(conversationId, dto.pinned);
    return this.getByIdOrThrow(conversationId);
  }

  /**
   * Refresh the denormalized last-message snapshot. Called inside the
   * send-message transaction (session) so the message write and this update
   * commit together. lastMessage is immutable, so this is safe to denormalize.
   */
  updateLastMessage(
    conversationId: string,
    snapshot: LastMessageSnapshot,
    session?: ClientSession,
  ): Promise<void> {
    return this.conversationsRepository.updateLastMessage(
      conversationId,
      snapshot,
      session,
    );
  }

  /**
   * The authorization rule, in one place: 404 if the conversation doesn't
   * exist, 403 if the caller isn't one of its two users.
   */
  async getForParticipant(
    conversationId: string,
    userId: string,
  ): Promise<StoredConversation> {
    const conversation = await this.getByIdOrThrow(conversationId);
    if (!conversation.participantIds.includes(userId)) {
      throw new AppException(
        403,
        'NOT_A_PARTICIPANT',
        'You are not a participant of this conversation',
      );
    }
    return conversation;
  }

  /** Lightweight authorization for writes that don't need the full read. */
  private async assertParticipant(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const participantIds =
      await this.conversationsRepository.findParticipantIds(conversationId);
    if (!participantIds) {
      throw new AppException(
        404,
        'CONVERSATION_NOT_FOUND',
        'Conversation not found',
      );
    }
    if (!participantIds.includes(userId)) {
      throw new AppException(
        403,
        'NOT_A_PARTICIPANT',
        'You are not a participant of this conversation',
      );
    }
  }

  private async getByIdOrThrow(id: string): Promise<StoredConversation> {
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

  /** Demo conversations between the seeded users. Data lives in seed-data.ts. */
  private async seedDemoConversations(): Promise<void> {
    if ((await this.conversationsRepository.count()) > 0) {
      return;
    }

    for (const seed of SEED_CONVERSATIONS) {
      await this.conversationsRepository.insert(
        seed.id,
        canonicalPair(seed.userAId, seed.userBId),
        buildPairKey(seed.userAId, seed.userBId),
        seed.pinnedDaysAgo !== undefined ? daysAgo(seed.pinnedDaysAgo) : null,
        buildSeedLastMessage(seed.id),
      );
    }
  }
}
