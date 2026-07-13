import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { DOCUMENT_STATUS_READY } from './documents.constants';
import { DocumentRecord } from './documents.schema';
import type {
  DocumentLean,
  DocumentStatus,
  StoredDocument,
} from './documents.types';

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectModel(DocumentRecord.name)
    private readonly documentModel: Model<DocumentRecord>,
  ) {}

  async insert(
    id: string,
    userId: string,
    tutorId: string,
    source: string,
    session?: ClientSession,
  ): Promise<StoredDocument> {
    const [created] = await this.documentModel.create(
      [{ _id: id, userId, tutorId, source }],
      { session },
    );
    return {
      id: created._id,
      userId: created.userId,
      tutorId: created.tutorId,
      source: created.source,
      contentHash: created.contentHash,
      status: created.status,
      chunkCount: created.chunkCount,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async findByUserTutorSource(
    userId: string,
    tutorId: string,
    source: string,
  ): Promise<StoredDocument | undefined> {
    const doc = await this.documentModel
      .findOne({ userId, tutorId, source })
      .lean<DocumentLean | null>()
      .exec();
    return doc ? mapDocToStored(doc) : undefined;
  }

  async findAllByUserAndTutor(
    userId: string,
    tutorId: string,
  ): Promise<StoredDocument[]> {
    const docs = await this.documentModel
      .find({ userId, tutorId })
      .sort({ createdAt: -1 })
      .lean<DocumentLean[]>()
      .exec();
    return docs.map(mapDocToStored);
  }

  async countByTutor(userId: string, tutorId: string): Promise<number> {
    return this.documentModel.countDocuments({ userId, tutorId }).exec();
  }

  async findOwned(
    userId: string,
    id: string,
  ): Promise<StoredDocument | undefined> {
    const doc = await this.documentModel
      .findOne({ _id: id, userId })
      .lean<DocumentLean | null>()
      .exec();
    return doc ? mapDocToStored(doc) : undefined;
  }

  async markIngested(
    id: string,
    contentHash: string,
    chunkCount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.documentModel
      .updateOne(
        { _id: id },
        { $set: { contentHash, chunkCount, status: DOCUMENT_STATUS_READY } },
        { session },
      )
      .exec();
  }

  async deleteOwned(
    userId: string,
    id: string,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this.documentModel
      .deleteOne({ _id: id, userId }, { session })
      .exec();
    return result.deletedCount ?? 0;
  }
}

function mapDocToStored(doc: DocumentLean): StoredDocument {
  return {
    id: doc._id,
    userId: doc.userId,
    tutorId: doc.tutorId,
    source: doc.source,
    contentHash: doc.contentHash,
    status: doc.status as DocumentStatus,
    chunkCount: doc.chunkCount,
    createdAt: doc.createdAt.toISOString(),
  };
}
