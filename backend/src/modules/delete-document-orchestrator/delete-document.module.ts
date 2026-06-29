import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { MongoModule } from '../mongo/mongo.module';
import { DeleteDocumentOrchestrator } from './delete-document.orchestrator';

@Module({
  imports: [DocumentsModule, KnowledgeModule, MongoModule],
  providers: [DeleteDocumentOrchestrator],
  exports: [DeleteDocumentOrchestrator],
})
export class DeleteDocumentModule {}
