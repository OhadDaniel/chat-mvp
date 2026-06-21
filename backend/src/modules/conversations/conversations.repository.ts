import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ConversationDocument } from './conversations.schema';
import type {
  LastMessageSnapshot,
  StoredConversation,
} from './conversations.types';

type ConversationLean = {
  _id: string;
  participantIds: string[];
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

  async findAllByUserId(userId: string): Promise<StoredConversation[]> {
    const docs = await this.conversationModel
      .find({ participantIds: userId })
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .lean<ConversationLean[]>()
      .exec();
    return docs.map(mapDocToStored);
  }

  async findById(id: string): Promise<StoredConversation | undefined> {
    const doc = await this.conversationModel
      .findById(id)
      .lean<ConversationLean | null>()
      .exec();
    return doc ? mapDocToStored(doc) : undefined;
  }

  async findParticipantIds(id: string): Promise<string[] | undefined> {
    const doc = await this.conversationModel
      .findById(id)
      .select('participantIds')
      .lean<{ participantIds: string[] } | null>()
      .exec();
    return doc ? doc.participantIds : undefined;
  }

  async insert(
    id: string,
    participantIds: string[],
    pairKey: string,
    pinnedAt: Date | null = null,
    lastMessage: LastMessageSnapshot | null = null,
  ): Promise<void> {
    await this.conversationModel.create({
      _id: id,
      participantIds,
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

  async count(): Promise<number> {
    return this.conversationModel.countDocuments().exec();
  }
}

function mapDocToStored(doc: ConversationLean): StoredConversation {
  return {
    id: doc._id,
    participantIds: doc.participantIds,
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
