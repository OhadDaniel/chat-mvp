import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { toDocumentSummary } from '../documents/documents.mappers';
import { DocumentsService } from '../documents/documents.service';
import type { ListDocumentsResponse } from '../documents/documents.types';

@Injectable()
export class ListDocumentsOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly documentsService: DocumentsService,
  ) {}

  async execute(
    userId: string,
    tutorId: string,
  ): Promise<ListDocumentsResponse> {
    await this.conversationsService.assertTutorOwner(tutorId, userId);
    const documents = await this.documentsService.list(userId, tutorId);
    return { documents: documents.map(toDocumentSummary) };
  }
}
