import { Injectable } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { TransactionRunner } from '../mongo/transaction.runner';

@Injectable()
export class DeleteDocumentOrchestrator {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly knowledgeService: KnowledgeService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(userId: string, documentId: string): Promise<void> {
    const document = await this.documentsService.getOwned(userId, documentId);
    await this.transactionRunner.run(async (session) => {
      await this.knowledgeService.deleteDocument(
        userId,
        document.tutorId,
        document.id,
        session,
      );
      await this.documentsService.delete(userId, document.id, session);
    });
  }
}
