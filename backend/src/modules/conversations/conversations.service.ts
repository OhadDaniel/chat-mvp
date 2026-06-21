import { randomUUID } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientSession } from 'mongoose';
import type { Avatar } from '../users/users.types';
import { isDuplicateKeyError } from '../mongo/mongo-errors';
import { daysAgo, SEED_CONVERSATIONS } from '../mongo/seed-data';
import {
  buildPairKey,
  buildSeedLastMessage,
  canonicalPair,
} from './conversations.helpers';
import { ConversationsRepository } from './conversations.repository';
import { ConversationAlreadyExistsError } from './errors/conversation-already-exists.error';
import { ConversationNotFoundError } from './errors/conversation-not-found.error';
import { InvalidParticipantError } from './errors/invalid-participant.error';
import { NotAParticipantError } from './errors/not-a-participant.error';
import { NotGroupOwnerError } from './errors/not-group-owner.error';
import type {
  LastMessageSnapshot,
  StoredConversation,
} from './conversations.types';
import type { PatchConversationDto } from './dto/patch-conversation.request.dto';

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
      throw new InvalidParticipantError();
    }

    const pairKey = buildPairKey(currentUserId, participantId);
    const id = randomUUID();
    try {
      await this.conversationsRepository.insertDirect(
        id,
        canonicalPair(currentUserId, participantId),
        pairKey,
      );
    } catch (error) {
      // The unique pairKey index is the only real guard against duplicates:
      // a collision — including from a concurrent create — is rejected here
      // and mapped to 409. (A read-then-write pre-check can't be race-safe.)
      if (isDuplicateKeyError(error)) {
        throw new ConversationAlreadyExistsError();
      }
      throw error;
    }

    return this.getByIdOrThrow(id);
  }

  /**
   * Create a group. Unlike a DM there is no uniqueness rule — two groups may
   * share the same members (the title tells them apart), so there's no pairKey
   * and no duplicate to guard against. The creator is always a member.
   */
  async createGroup(
    currentUserId: string,
    name: string,
    participantIds: string[],
  ): Promise<StoredConversation> {
    const id = randomUUID();
    const members = [...new Set([currentUserId, ...participantIds])];
    await this.conversationsRepository.insertGroup(
      id,
      members,
      name,
      currentUserId,
    );
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

  /** Rename a group — creator only. Title is a plain field, nothing derives from it. */
  async renameGroup(
    conversationId: string,
    userId: string,
    name: string,
  ): Promise<StoredConversation> {
    await this.assertGroupOwner(conversationId, userId);
    await this.conversationsRepository.setGroupName(conversationId, name);
    return this.getByIdOrThrow(conversationId);
  }

  /** Point a group at its uploaded photo — creator only. */
  async setGroupAvatar(
    conversationId: string,
    userId: string,
    avatar: Avatar,
  ): Promise<StoredConversation> {
    await this.assertGroupOwner(conversationId, userId);
    await this.conversationsRepository.setGroupAvatar(conversationId, avatar);
    return this.getByIdOrThrow(conversationId);
  }

  /**
   * Clear a group's photo — creator only. Like the user avatar, the stored
   * object is left in place (overwritten on the next upload), so there is no
   * post-commit delete that could fail an already-saved change.
   */
  async removeGroupAvatar(
    conversationId: string,
    userId: string,
  ): Promise<StoredConversation> {
    await this.assertGroupOwner(conversationId, userId);
    await this.conversationsRepository.setGroupAvatar(conversationId, null);
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
      throw new NotAParticipantError();
    }
    return conversation;
  }

  /**
   * Lightweight authorization for writes that don't need the full read:
   * reads only the participant id list (projection), 404 if missing, 403 if
   * the caller isn't one of the two users. Used by pinning and send-message.
   */
  async assertParticipant(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const participantIds =
      await this.conversationsRepository.findParticipantIds(conversationId);
    if (!participantIds) {
      throw new ConversationNotFoundError();
    }
    if (!participantIds.includes(userId)) {
      throw new NotAParticipantError();
    }
  }

  /**
   * Authorization for editing a group (title or photo): 404 if it's not an
   * existing group, 403 if the caller didn't create it. Used by rename and the
   * group-avatar endpoints.
   */
  async assertGroupOwner(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const conversation = await this.getByIdOrThrow(conversationId);
    if (conversation.type !== 'group') {
      throw new ConversationNotFoundError();
    }
    if (conversation.createdBy !== userId) {
      throw new NotGroupOwnerError();
    }
  }

  private async getByIdOrThrow(id: string): Promise<StoredConversation> {
    const conversation = await this.conversationsRepository.findById(id);
    if (!conversation) {
      throw new ConversationNotFoundError();
    }
    return conversation;
  }

  /** Demo conversations between the seeded users. Data lives in seed-data.ts. */
  private async seedDemoConversations(): Promise<void> {
    if ((await this.conversationsRepository.count()) > 0) {
      return;
    }

    for (const seed of SEED_CONVERSATIONS) {
      const pinnedAt =
        seed.pinnedDaysAgo !== undefined ? daysAgo(seed.pinnedDaysAgo) : null;
      const lastMessage = buildSeedLastMessage(seed.id);

      if (seed.type === 'group') {
        await this.conversationsRepository.insertGroup(
          seed.id,
          seed.memberIds,
          seed.name,
          seed.createdBy,
          pinnedAt,
          lastMessage,
        );
      } else {
        await this.conversationsRepository.insertDirect(
          seed.id,
          canonicalPair(seed.userAId, seed.userBId),
          buildPairKey(seed.userAId, seed.userBId),
          pinnedAt,
          lastMessage,
        );
      }
    }
  }
}
