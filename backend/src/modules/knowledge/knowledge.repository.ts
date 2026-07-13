import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  AnyBulkWriteOperation,
  ClientSession,
  PipelineStage,
} from 'mongoose';
import {
  EMBEDDING_PATH,
  KNOWLEDGE_VECTOR_INDEX,
  VECTOR_NUM_CANDIDATES,
} from './knowledge.constants';
import { KnowledgeChunkDocument } from './knowledge.schema';
import type { KnowledgeChunkInput, RetrievedChunk } from './knowledge.types';

type RetrievedChunkLean = {
  _id: string;
  docId: string;
  source: string;
  chunkIndex: number;
  text: string;
  score: number;
};

@Injectable()
export class KnowledgeRepository {
  constructor(
    @InjectModel(KnowledgeChunkDocument.name)
    private readonly knowledgeChunkModel: Model<KnowledgeChunkDocument>,
  ) {}

  async upsertMany(
    chunks: KnowledgeChunkInput[],
    session?: ClientSession,
  ): Promise<void> {
    if (chunks.length === 0) {
      return;
    }
    const operations: AnyBulkWriteOperation<KnowledgeChunkDocument>[] =
      chunks.map((chunk) => ({
        updateOne: {
          filter: { _id: chunkDocumentId(chunk.docId, chunk.chunkIndex) },
          update: { $set: chunk },
          upsert: true,
        },
      }));
    await this.knowledgeChunkModel.bulkWrite(operations, { session });
  }

  async vectorSearch(
    userId: string,
    tutorId: string,
    embedding: number[],
    k: number,
  ): Promise<RetrievedChunk[]> {
    const pipeline: PipelineStage[] = [
      {
        $vectorSearch: {
          index: KNOWLEDGE_VECTOR_INDEX,
          path: EMBEDDING_PATH,
          queryVector: embedding,
          filter: { userId, tutorId },
          numCandidates: VECTOR_NUM_CANDIDATES,
          limit: k,
        },
      } as unknown as PipelineStage,
      {
        $project: {
          _id: 1,
          docId: 1,
          source: 1,
          chunkIndex: 1,
          text: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];
    const rows =
      await this.knowledgeChunkModel.aggregate<RetrievedChunkLean>(pipeline);
    return rows.map(mapDocToRetrieved);
  }

  async deleteByDoc(
    userId: string,
    tutorId: string,
    docId: string,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this.knowledgeChunkModel
      .deleteMany({ userId, tutorId, docId }, { session })
      .exec();
    return result.deletedCount ?? 0;
  }
}

function chunkDocumentId(docId: string, chunkIndex: number): string {
  return `${docId}:${chunkIndex}`;
}

function mapDocToRetrieved(doc: RetrievedChunkLean): RetrievedChunk {
  return {
    id: doc._id,
    docId: doc.docId,
    source: doc.source,
    chunkIndex: doc.chunkIndex,
    text: doc.text,
    score: doc.score,
  };
}
