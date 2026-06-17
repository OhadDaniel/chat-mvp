import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, QueryFilter } from 'mongoose';
import { buildNameSearchRegex } from './conversations.helpers';
import { ConversationDocument } from './conversations.schema';
import type {
  Conversation,
  LastMessageSnapshot,
  ParticipantSnapshot,
} from './conversations.types';
import type { UserProfile } from '../users/users.types';

type ConversationLean = {
  _id: string;
  participants: ParticipantSnapshot[];
  lastMessage: { content: string; sentAt: Date; senderId: string } | null;
  lastMessageAt: Date | null;
  pinnedAt: Date | null;
};

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectModel(ConversationDocument.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  async findAllByUserId(
    userId: string,
    search?: string,
  ): Promise<Conversation[]> {
    const filter: QueryFilter<ConversationDocument> = search
      ? {
          'participants.userId': userId,
          'participants.name': buildNameSearchRegex(search),
        }
      : { 'participants.userId': userId };

    const docs = await this.conversationModel
      .find(filter)
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .lean<ConversationLean[]>()
      .exec();
    return docs.map(mapDocToConversation);
  }

  async findById(id: string): Promise<Conversation | undefined> {
    const doc = await this.conversationModel
      .findById(id)
      .lean<ConversationLean | null>()
      .exec();
    return doc ? mapDocToConversation(doc) : undefined;
  }

  async findParticipantIds(id: string): Promise<string[] | undefined> {
    const doc = await this.conversationModel
      .findById(id)
      .select('participants.userId')
      .lean<{ participants: { userId: string }[] } | null>()
      .exec();
    return doc ? doc.participants.map((participant) => participant.userId) : undefined;
  }

  async existsByPair(pairKey: string): Promise<boolean> {
    const existing = await this.conversationModel.exists({ pairKey }).exec();
    return existing !== null;
  }

  async insert(
    id: string,
    participants: ParticipantSnapshot[],
    pairKey: string,
    pinnedAt: Date | null = null,
    lastMessage: LastMessageSnapshot | null = null,
  ): Promise<void> {
    await this.conversationModel.create({
      _id: id,
      participants,
      pairKey,
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

  /** Keep a user's denormalized snapshot current wherever they're a participant. */
  async updateParticipant(profile: UserProfile): Promise<void> {
    await this.conversationModel
      .updateMany(
        { 'participants.userId': profile.id },
        {
          $set: {
            'participants.$[p].name': profile.name,
            'participants.$[p].avatarInitials': profile.avatarInitials,
            'participants.$[p].avatarUrl': profile.avatarUrl,
          },
        },
        { arrayFilters: [{ 'p.userId': profile.id }] },
      )
      .exec();
  }

  async count(): Promise<number> {
    return this.conversationModel.countDocuments().exec();
  }
}

function mapDocToConversation(doc: ConversationLean): Conversation {
  return {
    id: doc._id,
    participants: doc.participants.map((participant) => ({
      id: participant.userId,
      name: participant.name,
      avatarInitials: participant.avatarInitials,
      avatarUrl: participant.avatarUrl,
    })),
    lastMessage: doc.lastMessage
      ? {
          content: doc.lastMessage.content,
          sentAt: doc.lastMessage.sentAt.toISOString(),
          senderId: doc.lastMessage.senderId,
        }
      : null,
    lastMessageAt: doc.lastMessageAt ? doc.lastMessageAt.toISOString() : null,
    pinnedAt: doc.pinnedAt ? doc.pinnedAt.toISOString() : null,
  };
}
