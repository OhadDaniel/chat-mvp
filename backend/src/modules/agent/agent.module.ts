import { Module } from '@nestjs/common';
import { ChatModelModule } from '../chat-model/chat-model.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { MessagesModule } from '../messages/messages.module';
import { AgentGraph } from './agent.graph';
import { MongoCheckpointerProvider } from './checkpointer/mongo-checkpointer.provider';

@Module({
  imports: [ChatModelModule, EmbeddingModule, KnowledgeModule, MessagesModule],
  providers: [MongoCheckpointerProvider, AgentGraph],
  exports: [AgentGraph],
})
export class AgentModule {}
