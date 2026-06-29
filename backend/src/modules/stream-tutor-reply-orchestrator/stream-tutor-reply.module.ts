import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { ChatModelModule } from '../chat-model/chat-model.module';
import { MongoModule } from '../mongo/mongo.module';
import { StreamTutorReplyOrchestrator } from './stream-tutor-reply.orchestrator';

@Module({
  imports: [
    ConversationsModule,
    MessagesModule,
    EmbeddingModule,
    KnowledgeModule,
    ChatModelModule,
    MongoModule,
  ],
  providers: [StreamTutorReplyOrchestrator],
  exports: [StreamTutorReplyOrchestrator],
})
export class StreamTutorReplyModule {}
