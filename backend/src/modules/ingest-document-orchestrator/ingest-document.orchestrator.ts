import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { DOCUMENT_STATUS_READY } from '../documents/documents.constants';
import { toDocumentSummary } from '../documents/documents.mappers';
import { InvalidDocumentError } from '../documents/errors/invalid-document.error';
import { DocumentsService } from '../documents/documents.service';
import { EmbeddingProvider } from '../embedding/embedding-provider';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { TransactionRunner } from '../mongo/transaction.runner';
import { assertValidUpload } from './assert-valid-upload';
import { chunkText } from './chunk-text';
import { extractText } from './extract-text';
import type { UploadedDocumentFile } from './ingest-document.types';
import type {
  IngestDocumentResponse,
  StoredDocument,
} from '../documents/documents.types';
import type { KnowledgeChunkInput } from '../knowledge/knowledge.types';

@Injectable()
export class IngestDocumentOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly documentsService: DocumentsService,
    private readonly knowledgeService: KnowledgeService,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    userId: string,
    tutorId: string,
    file: UploadedDocumentFile | undefined,
  ): Promise<IngestDocumentResponse> {
    await this.conversationsService.assertTutorOwner(tutorId, userId);
    assertValidUpload(file);
    await this.documentsService.assertWithinDocumentLimit(
      userId,
      tutorId,
      file.originalname,
    );
    const text = extractText(file.buffer);
    if (text.trim() === '') {
      throw new InvalidDocumentError('The document has no readable text');
    }
    const contentHash = hashContent(text);

    const document = await this.documentsService.getOrCreate(
      userId,
      tutorId,
      file.originalname,
    );

    if (
      document.status === DOCUMENT_STATUS_READY &&
      document.contentHash === contentHash
    ) {
      return { document: toDocumentSummary(document) };
    }

    const chunks = await this.buildChunks(userId, tutorId, document, text);

    await this.transactionRunner.run(async (session) => {
      await this.knowledgeService.deleteDocument(
        userId,
        tutorId,
        document.id,
        session,
      );
      await this.knowledgeService.storeChunks(chunks, session);
      await this.documentsService.markIngested(
        document.id,
        contentHash,
        chunks.length,
        session,
      );
    });

    return {
      document: toDocumentSummary({
        ...document,
        status: DOCUMENT_STATUS_READY,
        contentHash,
        chunkCount: chunks.length,
      }),
    };
  }

  private async buildChunks(
    userId: string,
    tutorId: string,
    document: StoredDocument,
    text: string,
  ): Promise<KnowledgeChunkInput[]> {
    const pieces = await chunkText(text);
    const embeddings = await this.embeddingProvider.embed(
      pieces.map((piece) => piece.text),
    );
    return pieces.map((piece, index) => ({
      userId,
      tutorId,
      docId: document.id,
      source: document.source,
      chunkIndex: piece.chunkIndex,
      text: piece.text,
      embedding: embeddings[index],
    }));
  }
}

function hashContent(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}
