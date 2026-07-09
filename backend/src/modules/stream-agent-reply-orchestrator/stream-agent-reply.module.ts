import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { MongoModule } from '../mongo/mongo.module';
import { StreamAgentReplyOrchestrator } from './stream-agent-reply.orchestrator';

@Module({
  imports: [AgentModule, ConversationsModule, MessagesModule, MongoModule],
  providers: [StreamAgentReplyOrchestrator],
  exports: [StreamAgentReplyOrchestrator],
})
export class StreamAgentReplyModule {}
