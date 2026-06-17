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
export class ParticipantDocument {
  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  avatarInitials!: string;

  @Prop({ type: String, default: null })
  avatarUrl!: string | null;
}

export const ParticipantSchema = SchemaFactory.createForClass(ParticipantDocument);

@Schema({ collection: 'conversations', versionKey: false })
export class ConversationDocument {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: [ParticipantSchema], required: true })
  participants!: ParticipantDocument[];

  @Prop({ type: String, required: true })
  pairKey!: string;

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

ConversationSchema.index({ pairKey: 1 }, { unique: true });
ConversationSchema.index({
  'participants.userId': 1,
  lastMessageAt: -1,
  createdAt: -1,
});
