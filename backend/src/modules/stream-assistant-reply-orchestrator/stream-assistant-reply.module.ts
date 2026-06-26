import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { MongoModule } from '../mongo/mongo.module';
import { AssistantModule } from '../ai-assistant/ai-assistant.module';
import { StreamAssistantReplyOrchestrator } from './stream-assistant-reply.orchestrator';

@Module({
  imports: [ConversationsModule, MessagesModule, MongoModule, AssistantModule],
  providers: [StreamAssistantReplyOrchestrator],
  exports: [StreamAssistantReplyOrchestrator],
})
export class StreamAssistantReplyModule {}
