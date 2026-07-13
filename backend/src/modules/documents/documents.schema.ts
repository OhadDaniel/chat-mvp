import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DOCUMENT_STATUS_PENDING,
  DOCUMENT_STATUSES,
  DOCUMENTS_COLLECTION,
} from './documents.constants';
import type { DocumentStatus } from './documents.types';

@Schema({ collection: DOCUMENTS_COLLECTION, versionKey: false })
export class DocumentRecord {
  @Prop({ type: String })
  _id!: string;

  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  tutorId!: string;

  @Prop({ type: String, required: true })
  source!: string;

  @Prop({ type: String, default: null })
  contentHash!: string | null;

  @Prop({
    type: String,
    required: true,
    enum: DOCUMENT_STATUSES,
    default: DOCUMENT_STATUS_PENDING,
  })
  status!: DocumentStatus;

  @Prop({ type: Number, default: 0 })
  chunkCount!: number;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const DocumentRecordSchema = SchemaFactory.createForClass(DocumentRecord);

DocumentRecordSchema.index(
  { userId: 1, tutorId: 1, source: 1 },
  { unique: true },
);
