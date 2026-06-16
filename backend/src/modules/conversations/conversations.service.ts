import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientSession } from 'mongoose';
import { AppException } from '../../common/errors/app.exception';
import { isDuplicateKeyError } from '../mongo/mongo-errors';
import { daysAgo, SEED_CONVERSATIONS } from '../mongo/seed-data';
import { buildSeedLastMessage } from './conversations.helpers';
import { ConversationsRepository } from './conversations.repository';
import type {
  Conversation,
  CreateConversationResponse,
  GetConversationsResponse,
  LastMessageSnapshot,
  PatchConversationResponse,
} from './conversations.types';
import type { PatchConversationDto } from './dto/patch-conversation.dto';

/**
 * Owns the conversations domain: the pair rules (distinct users,
 * one conversation per pair), pinning, and the participant
 * authorization rule (403). Single-entity — checking that the other
 * participant exists is the create-conversation orchestrator's job.
 */
@Injectable()
export class ConversationsService implements OnModuleInit {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
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
    currentUserId: string,
    participantId: string,
  ): Promise<CreateConversationResponse> {
    if (participantId === currentUserId) {
      throw new AppException(
        400,
        'INVALID_PARTICIPANT',
        'Cannot start a conversation with yourself',
      );
    }

    // Canonical order (a < b): one representation per pair, so the
    // UNIQUE constraint can do its job regardless of who initiates.
    const [userAId, userBId] = [currentUserId, participantId].sort();

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

    const conversation = await this.getByIdOrThrow(id);
    return { conversation };
  }

  async setPinned(
    conversationId: string,
    userId: string,
    dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    // Gate on the participant pair only — no need to hydrate the whole
    // conversation just to authorize. The single full read happens once,
    // after the write, to build the response.
    await this.assertParticipant(conversationId, userId);
    await this.conversationsRepository.setPinned(conversationId, dto.pinned);

    const conversation = await this.getByIdOrThrow(conversationId);
    return { conversation };
  }

  /**
   * Refresh the denormalized last-message snapshot. Called inside the
   * send-message transaction (session) so the message write and this
   * update commit together. Thin pass-through — the repository owns the
   * write; this service never inspects the session.
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
   * Same 404-before-403 rule as getForParticipant, but authorizes off the
   * lightweight pair lookup instead of the full hydrated read.
   */
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

  /**
   * The authorization rule, in one place: 404 if the conversation
   * doesn't exist, 403 if the caller isn't one of its two users.
   * MessagesService composes this — every message read/write passes
   * through here first.
   */
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

  /** Demo conversations between the seeded users. Data lives in seed-data.ts. */
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
        buildSeedLastMessage(seed.id),
      );
    }
  }
}
