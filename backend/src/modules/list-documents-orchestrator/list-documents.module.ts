import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { DocumentsModule } from '../documents/documents.module';
import { ListDocumentsOrchestrator } from './list-documents.orchestrator';

@Module({
  imports: [ConversationsModule, DocumentsModule],
  providers: [ListDocumentsOrchestrator],
  exports: [ListDocumentsOrchestrator],
})
export class ListDocumentsModule {}
