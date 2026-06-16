import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PipelineStage } from 'mongoose';
import {
  buildPairKey,
  canonicalPair,
  hydrateParticipantsStage,
  participantNameSearchStage,
} from './conversations.helpers';
import {
  ConversationMongo,
  type ConversationDocument,
} from './conversations.schema';
import type { Conversation, LastMessageSnapshot } from './conversations.types';
import { displayName, initialsOf } from '../users/users.helpers';
import { StorageService } from '../storage/storage.service';

type ParticipantDoc = {
  _id: string;
  firstName: string;
  lastName: string;
  avatarKey: string | null;
};

type ConversationAggRow = {
  _id: string;
  participantIds: string[];
  lastMessage: LastMessageSnapshot | null;
  lastMessageAt: Date | null;
  pinnedAt: Date | null;
  participants: ParticipantDoc[];
};

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectModel(ConversationMongo.name)
    private readonly conversationModel: Model<ConversationDocument>,
    private readonly storage: StorageService,
  ) {}

  async findAllByUserId(
    userId: string,
    search?: string,
  ): Promise<Conversation[]> {
    const pipeline: PipelineStage[] = [
      { $match: { participantIds: userId } },
      { $sort: { lastMessageAt: -1, createdAt: -1 } },
      hydrateParticipantsStage(),
    ];

    if (search) {
      pipeline.push(participantNameSearchStage(search));
    }

    const rows = await this.conversationModel
      .aggregate<ConversationAggRow>(pipeline)
      .exec();
    return rows.map((row) => this.mapDocToConversation(row));
  }

  async findById(id: string): Promise<Conversation | undefined> {
    const rows = await this.conversationModel
      .aggregate<ConversationAggRow>([
        { $match: { _id: id } },
        hydrateParticipantsStage(),
      ])
      .exec();
    return rows[0] ? this.mapDocToConversation(rows[0]) : undefined;
  }

  async findParticipantIds(id: string): Promise<string[] | undefined> {
    const doc = await this.conversationModel
      .findById(id)
      .select('participantIds')
      .lean<{ participantIds: string[] } | null>()
      .exec();
    return doc ? doc.participantIds : undefined;
  }

  async existsByPair(userAId: string, userBId: string): Promise<boolean> {
    const existing = await this.conversationModel
      .exists({ pairKey: buildPairKey(userAId, userBId) })
      .exec();
    return existing !== null;
  }

  async insert(
    id: string,
    userAId: string,
    userBId: string,
    pinnedAt: Date | null = null,
    lastMessage: LastMessageSnapshot | null = null,
  ): Promise<void> {
    await this.conversationModel.create({
      _id: id,
      participantIds: canonicalPair(userAId, userBId),
      pairKey: buildPairKey(userAId, userBId),
      pinnedAt,
      lastMessage,
      lastMessageAt: lastMessage ? lastMessage.sentAt : null,
    });
  }

  async setPinned(id: string, pinned: boolean): Promise<void> {
    await this.conversationModel
      .updateOne(
        { _id: id },
        { $set: { pinnedAt: pinned ? new Date() : null } },
      )
      .exec();
  }

  async updateLastMessage(
    conversationId: string,
    snapshot: LastMessageSnapshot,
    session?: ClientSession,
  ): Promise<void> {
    await this.conversationModel
      .updateOne(
        { _id: conversationId },
        { $set: { lastMessage: snapshot, lastMessageAt: snapshot.sentAt } },
        { session },
      )
      .exec();
  }

  async count(): Promise<number> {
    return this.conversationModel.countDocuments().exec();
  }

  private mapDocToConversation(row: ConversationAggRow): Conversation {
    const participants = row.participantIds.map((id) => {
      const doc = row.participants.find(
        (participant) => participant._id === id,
      );
      const firstName = doc?.firstName ?? '';
      const lastName = doc?.lastName ?? '';
      return {
        id,
        name: displayName(firstName, lastName),
        avatarInitials: initialsOf(firstName, lastName),
        avatarUrl: this.storage.publicUrl(doc?.avatarKey ?? null),
      };
    });

    const lastMessage = row.lastMessage
      ? {
          content: row.lastMessage.content,
          sentAt: row.lastMessage.sentAt.toISOString(),
          senderId: row.lastMessage.senderId,
        }
      : null;

    return {
      id: row._id,
      participants,
      lastMessage,
      lastMessageAt: row.lastMessageAt ? row.lastMessageAt.toISOString() : null,
      pinnedAt: row.pinnedAt ? row.pinnedAt.toISOString() : null,
    };
  }
}
