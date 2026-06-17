import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class LastMessageMongo {
  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: Date, required: true })
  sentAt!: Date;

  @Prop({ type: String, required: true })
  senderId!: string;
}

export const LastMessageSchema = SchemaFactory.createForClass(LastMessageMongo);

@Schema({ _id: false, versionKey: false })
export class ParticipantMongo {
  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  avatarInitials!: string;

  @Prop({ type: String, default: null })
  avatarUrl!: string | null;
}

export const ParticipantSchema = SchemaFactory.createForClass(ParticipantMongo);

@Schema({ collection: 'conversations', versionKey: false })
export class ConversationMongo {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: [ParticipantSchema], required: true })
  participants!: ParticipantMongo[];

  @Prop({ type: String, required: true })
  pairKey!: string;

  @Prop({ type: LastMessageSchema, default: null })
  lastMessage!: LastMessageMongo | null;

  @Prop({ type: Date, default: null })
  lastMessageAt!: Date | null;

  @Prop({ type: Date, default: null })
  pinnedAt!: Date | null;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export type ConversationDocument = HydratedDocument<ConversationMongo>;

export const ConversationSchema = SchemaFactory.createForClass(ConversationMongo);

ConversationSchema.index({ pairKey: 1 }, { unique: true });
ConversationSchema.index({
  'participants.userId': 1,
  lastMessageAt: -1,
  createdAt: -1,
});
