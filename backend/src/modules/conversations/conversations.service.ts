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
      if (isDuplicateKeyError(error)) {
        throw new ConversationAlreadyExistsError();
      }
      throw error;
    }

    return this.getByIdOrThrow(id);
  }


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

  async createAssistant(userId: string): Promise<StoredConversation> {
    const existing =
      await this.conversationsRepository.findAssistantByUserId(userId);
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    try {
      await this.conversationsRepository.insertAssistant(id, userId);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const winner =
          await this.conversationsRepository.findAssistantByUserId(userId);
        if (winner) {
          return winner;
        }
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

  async renameGroup(
    conversationId: string,
    userId: string,
    name: string,
  ): Promise<StoredConversation> {
    await this.assertGroupOwner(conversationId, userId);
    await this.conversationsRepository.setGroupName(conversationId, name);
    return this.getByIdOrThrow(conversationId);
  }

 
  async setGroupAvatar(
    conversationId: string,
    userId: string,
    avatar: Avatar,
  ): Promise<StoredConversation> {
    await this.assertGroupOwner(conversationId, userId);
    await this.conversationsRepository.setGroupAvatar(conversationId, avatar);
    return this.getByIdOrThrow(conversationId);
  }

  
  async removeGroupAvatar(
    conversationId: string,
    userId: string,
  ): Promise<StoredConversation> {
    await this.assertGroupOwner(conversationId, userId);
    await this.conversationsRepository.setGroupAvatar(conversationId, null);
    return this.getByIdOrThrow(conversationId);
  }


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
