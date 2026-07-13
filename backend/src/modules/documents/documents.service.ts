import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { ClientSession } from 'mongoose';
import { isDuplicateKeyError } from '../mongo/mongo-errors';
import { MAX_DOCUMENTS_PER_TUTOR } from './documents.constants';
import { DocumentsRepository } from './documents.repository';
import { DocumentLimitReachedError } from './errors/document-limit-reached.error';
import { DocumentNotFoundError } from './errors/document-not-found.error';
import type { StoredDocument } from './documents.types';

@Injectable()
export class DocumentsService {
  constructor(private readonly documentsRepository: DocumentsRepository) {}

  async assertWithinDocumentLimit(
    userId: string,
    tutorId: string,
    source: string,
  ): Promise<void> {
    const existing = await this.documentsRepository.findByUserTutorSource(
      userId,
      tutorId,
      source,
    );
    if (existing) {
      return;
    }
    const count = await this.documentsRepository.countByTutor(userId, tutorId);
    if (count >= MAX_DOCUMENTS_PER_TUTOR) {
      throw new DocumentLimitReachedError(MAX_DOCUMENTS_PER_TUTOR);
    }
  }

  async getOrCreate(
    userId: string,
    tutorId: string,
    source: string,
    session?: ClientSession,
  ): Promise<StoredDocument> {
    const id = randomUUID();
    try {
      return await this.documentsRepository.insert(
        id,
        userId,
        tutorId,
        source,
        session,
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const existing = await this.documentsRepository.findByUserTutorSource(
          userId,
          tutorId,
          source,
        );
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
  }

  markIngested(
    id: string,
    contentHash: string,
    chunkCount: number,
    session?: ClientSession,
  ): Promise<void> {
    return this.documentsRepository.markIngested(
      id,
      contentHash,
      chunkCount,
      session,
    );
  }

  list(userId: string, tutorId: string): Promise<StoredDocument[]> {
    return this.documentsRepository.findAllByUserAndTutor(userId, tutorId);
  }

  async getOwned(userId: string, id: string): Promise<StoredDocument> {
    const doc = await this.documentsRepository.findOwned(userId, id);
    if (!doc) {
      throw new DocumentNotFoundError();
    }
    return doc;
  }

  async delete(
    userId: string,
    id: string,
    session?: ClientSession,
  ): Promise<void> {
    await this.documentsRepository.deleteOwned(userId, id, session);
  }
}
