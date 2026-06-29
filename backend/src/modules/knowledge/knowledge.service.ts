import { Injectable } from '@nestjs/common';
import type { ClientSession } from 'mongoose';
import { DEFAULT_TOP_K, EMBEDDING_DIMENSIONS } from './knowledge.constants';
import { InvalidChunkError } from './errors/invalid-chunk.error';
import { KnowledgeRepository } from './knowledge.repository';
import type { KnowledgeChunkInput, RetrievedChunk } from './knowledge.types';

@Injectable()
export class KnowledgeService {
  constructor(private readonly knowledgeRepository: KnowledgeRepository) {}

  async storeChunks(
    chunks: KnowledgeChunkInput[],
    session?: ClientSession,
  ): Promise<void> {
    for (const chunk of chunks) {
      assertValidChunk(chunk);
    }
    await this.knowledgeRepository.upsertMany(chunks, session);
  }

  search(
    userId: string,
    tutorId: string,
    embedding: number[],
    k: number = DEFAULT_TOP_K,
  ): Promise<RetrievedChunk[]> {
    return this.knowledgeRepository.vectorSearch(userId, tutorId, embedding, k);
  }

  deleteDocument(
    userId: string,
    tutorId: string,
    docId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.knowledgeRepository.deleteByDoc(userId, tutorId, docId, session);
  }
}

function assertValidChunk(chunk: KnowledgeChunkInput): void {
  if (chunk.text.trim() === '') {
    throw new InvalidChunkError('Chunk text must not be empty');
  }
  if (chunk.embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new InvalidChunkError(
      `Chunk embedding must have ${EMBEDDING_DIMENSIONS} dimensions`,
    );
  }
}
