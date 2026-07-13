import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class LastMessageDocument {
  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: Date, required: true })
  sentAt!: Date;

  @Prop({ type: String, required: true })
  senderId!: string;
}

export const LastMessageSchema = SchemaFactory.createForClass(LastMessageDocument);

@Schema({ _id: false, versionKey: false })
export class DirectDocument {
  @Prop({ type: String, required: true })
  pairKey!: string;
}

export const DirectSchema = SchemaFactory.createForClass(DirectDocument);

@Schema({ _id: false, versionKey: false })
export class GroupAvatarDocument {
  @Prop({ type: String, required: true })
  storageKey!: string;

  @Prop({ type: String, required: true })
  srcUrl!: string;
}

export const GroupAvatarSchema =
  SchemaFactory.createForClass(GroupAvatarDocument);

@Schema({ _id: false, versionKey: false })
export class GroupDocument {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  createdBy!: string;

  @Prop({ type: GroupAvatarSchema, default: null })
  avatar!: GroupAvatarDocument | null;
}

export const GroupSchema = SchemaFactory.createForClass(GroupDocument);

@Schema({ _id: false, versionKey: false })
export class TutorDocument {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: GroupAvatarSchema, default: null })
  avatar!: GroupAvatarDocument | null;
}

export const TutorSchema = SchemaFactory.createForClass(TutorDocument);

export const CONVERSATION_TYPES = [
  'direct',
  'group',
  'assistant',
  'tutor',
] as const;
export type ConversationType = (typeof CONVERSATION_TYPES)[number];

@Schema({ collection: 'conversations', versionKey: false })
export class ConversationDocument {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: String, required: true, enum: CONVERSATION_TYPES })
  type!: ConversationType;

  @Prop({ type: [String], required: true })
  participantIds!: string[];

 
  @Prop({ type: DirectSchema, default: null })
  direct!: DirectDocument | null;

  @Prop({ type: GroupSchema, default: null })
  group!: GroupDocument | null;

  @Prop({ type: TutorSchema, default: null })
  tutor!: TutorDocument | null;

  @Prop({ type: LastMessageSchema, default: null })
  lastMessage!: LastMessageDocument | null;

  @Prop({ type: Date, default: null })
  lastMessageAt!: Date | null;

  @Prop({ type: Date, default: null })
  pinnedAt!: Date | null;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(ConversationDocument);


ConversationSchema.index(
  { 'direct.pairKey': 1 },
  { unique: true, partialFilterExpression: { type: 'direct' } },
);
ConversationSchema.index(
  { participantIds: 1 },
  { unique: true, partialFilterExpression: { type: 'assistant' } },
);
ConversationSchema.index({ participantIds: 1, lastMessageAt: -1, createdAt: -1 });
