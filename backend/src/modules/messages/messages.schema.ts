import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const MESSAGE_STATUS_SENT = 'sent';

@Schema({ _id: false, versionKey: false })
export class CitationDocument {
  @Prop({ type: String, required: true })
  chunkId!: string;

  @Prop({ type: String, required: true })
  documentName!: string;

  @Prop({ type: String, required: true })
  text!: string;
}

export const CitationSchema = SchemaFactory.createForClass(CitationDocument);

@Schema({ collection: 'messages', versionKey: false })
export class MessageDocument {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: String, required: true })
  conversationId!: string;

  @Prop({ type: String, required: true })
  senderId!: string;

  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: Date, default: Date.now })
  sentAt!: Date;

  @Prop({ type: String, default: MESSAGE_STATUS_SENT })
  status!: string;

  @Prop({ type: [CitationSchema], default: [] })
  citations!: CitationDocument[];
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);

MessageSchema.index({ conversationId: 1, sentAt: -1, _id: -1 });
