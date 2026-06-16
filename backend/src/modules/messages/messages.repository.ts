import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import type { UserProfile } from '../users/users.types';
import { displayName, initialsOf } from '../users/users.helpers';
import { StorageService } from '../storage/storage.service';
import { hydrateSenderStage, pageFilterStage } from './messages.helpers';
import {
  MESSAGE_STATUS_SENT,
  MessageMongo,
  type MessageDocument,
} from './messages.schema';
import type { CursorPoint, Message, MessagePage } from './messages.types';

type SenderDoc = {
  _id: string;
  firstName: string;
  lastName: string;
  avatarKey: string | null;
};

type MessageAggRow = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  sender: SenderDoc[];
};

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(MessageMongo.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly storage: StorageService,
  ) {}

  async findCursorPoint(
    conversationId: string,
    messageId: string,
  ): Promise<CursorPoint | undefined> {
    const doc = await this.messageModel
      .findOne({ _id: messageId, conversationId })
      .select('sentAt')
      .lean<{ _id: string; sentAt: Date } | null>()
      .exec();
    return doc ? { id: doc._id, sentAt: doc.sentAt } : undefined;
  }

  async findPageBefore(
    conversationId: string,
    before: CursorPoint | undefined,
    limit: number,
  ): Promise<MessagePage> {
    const rows = await this.messageModel
      .aggregate<MessageAggRow>([
        pageFilterStage(conversationId, before),
        { $sort: { sentAt: -1, _id: -1 } },
        { $limit: limit + 1 },
        hydrateSenderStage(),
      ])
      .exec();

    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit).reverse();
    return { messages: page.map((row) => this.mapDocToMessage(row)), hasMore };
  }

  async insert(
    id: string,
    conversationId: string,
    sender: UserProfile,
    content: string,
    session?: ClientSession,
  ): Promise<Message> {
    const [created] = await this.messageModel.create(
      [{ _id: id, conversationId, senderId: sender.id, content }],
      { session },
    );

    return {
      id,
      conversationId,
      sender,
      content,
      sentAt: created.sentAt.toISOString(),
      status: MESSAGE_STATUS_SENT,
    };
  }

  async insertSeed(
    id: string,
    conversationId: string,
    senderId: string,
    content: string,
    sentAt: Date,
  ): Promise<void> {
    await this.messageModel.create({
      _id: id,
      conversationId,
      senderId,
      content,
      sentAt,
    });
  }

  async count(): Promise<number> {
    return this.messageModel.countDocuments().exec();
  }

  private mapDocToMessage(row: MessageAggRow): Message {
    const senderDoc = row.sender[0];
    const firstName = senderDoc?.firstName ?? '';
    const lastName = senderDoc?.lastName ?? '';
    return {
      id: row._id,
      conversationId: row.conversationId,
      sender: {
        id: row.senderId,
        name: displayName(firstName, lastName),
        avatarInitials: initialsOf(firstName, lastName),
        avatarUrl: this.storage.publicUrl(senderDoc?.avatarKey ?? null),
      },
      content: row.content,
      sentAt: row.sentAt.toISOString(),
      status: MESSAGE_STATUS_SENT,
    };
  }
}
