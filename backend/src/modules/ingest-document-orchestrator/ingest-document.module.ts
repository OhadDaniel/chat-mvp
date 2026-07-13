import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { DocumentsModule } from '../documents/documents.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { MongoModule } from '../mongo/mongo.module';
import { IngestDocumentOrchestrator } from './ingest-document.orchestrator';

@Module({
  imports: [
    ConversationsModule,
    DocumentsModule,
    EmbeddingModule,
    KnowledgeModule,
    MongoModule,
  ],
  providers: [IngestDocumentOrchestrator],
  exports: [IngestDocumentOrchestrator],
})
export class IngestDocumentModule {}
