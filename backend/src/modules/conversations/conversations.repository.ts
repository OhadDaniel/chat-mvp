import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ConversationDocument } from './conversations.schema';
import type {
  LastMessageSnapshot,
  StoredConversation,
} from './conversations.types';

type LeanBase = {
  _id: string;
  participantIds: string[];
  lastMessage: { content: string; sentAt: Date; senderId: string } | null;
  lastMessageAt: Date | null;
  pinnedAt: Date | null;
};

type DirectLean = LeanBase & { type: 'direct' };

type GroupLean = LeanBase & {
  type: 'group';
  group: {
    name: string;
    createdBy: string;
    avatar: { storageKey: string; srcUrl: string } | null;
  };
};

type ConversationLean = DirectLean | GroupLean;

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

  async insertDirect(
    id: string,
    participantIds: string[],
    pairKey: string,
    pinnedAt: Date | null = null,
    lastMessage: LastMessageSnapshot | null = null,
  ): Promise<void> {
    await this.conversationModel.create({
      _id: id,
      type: 'direct',
      participantIds,
      direct: { pairKey },
      pinnedAt,
      lastMessage,
      lastMessageAt: lastMessage ? lastMessage.sentAt : null,
    });
  }

  async insertGroup(
    id: string,
    participantIds: string[],
    name: string,
    createdBy: string,
    pinnedAt: Date | null = null,
    lastMessage: LastMessageSnapshot | null = null,
  ): Promise<void> {
    await this.conversationModel.create({
      _id: id,
      type: 'group',
      participantIds,
      group: { name, createdBy, avatar: null },
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

  async setGroupName(id: string, name: string): Promise<void> {
    await this.conversationModel
      .updateOne({ _id: id }, { $set: { 'group.name': name } })
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
  const base = {
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

  if (doc.type === 'group') {
    return {
      ...base,
      type: 'group',
      name: doc.group.name,
      createdBy: doc.group.createdBy,
      avatar: doc.group.avatar ?? null,
    };
  }

  return { ...base, type: 'direct' };
}
