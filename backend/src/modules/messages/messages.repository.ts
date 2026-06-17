import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import type { UserProfile } from '../users/users.types';
import { buildPageFilter } from './messages.helpers';
import { MESSAGE_STATUS_SENT, MessageDocument } from './messages.schema';
import type {
  CursorPoint,
  Message,
  StoredMessage,
  StoredMessagePage,
} from './messages.types';

type MessageLean = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: Date;
};

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(MessageDocument.name)
    private readonly messageModel: Model<MessageDocument>,
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
  ): Promise<StoredMessagePage> {
    const rows = await this.messageModel
      .find(buildPageFilter(conversationId, before))
      .sort({ sentAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<MessageLean[]>()
      .exec();

    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit).reverse();
    return { messages: page.map(mapDocToStoredMessage), hasMore };
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
}

function mapDocToStoredMessage(doc: MessageLean): StoredMessage {
  return {
    id: doc._id,
    conversationId: doc.conversationId,
    senderId: doc.senderId,
    content: doc.content,
    sentAt: doc.sentAt.toISOString(),
  };
}
