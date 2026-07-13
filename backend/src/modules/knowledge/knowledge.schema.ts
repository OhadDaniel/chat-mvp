import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { KNOWLEDGE_COLLECTION } from './knowledge.constants';

@Schema({ collection: KNOWLEDGE_COLLECTION, versionKey: false })
export class KnowledgeChunkDocument {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  tutorId!: string;

  @Prop({ type: String, required: true })
  docId!: string;

  @Prop({ type: String, required: true })
  source!: string;

  @Prop({ type: Number, required: true })
  chunkIndex!: number;

  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: [Number], required: true })
  embedding!: number[];

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const KnowledgeChunkSchema = SchemaFactory.createForClass(
  KnowledgeChunkDocument,
);

KnowledgeChunkSchema.index({ userId: 1, tutorId: 1, docId: 1 });
