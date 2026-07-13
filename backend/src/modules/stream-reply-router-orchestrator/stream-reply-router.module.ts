import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { StreamAgentReplyModule } from '../stream-agent-reply-orchestrator/stream-agent-reply.module';
import { StreamReplyRouterOrchestrator } from './stream-reply-router.orchestrator';

@Module({
  imports: [ConversationsModule, StreamAgentReplyModule],
  providers: [StreamReplyRouterOrchestrator],
  exports: [StreamReplyRouterOrchestrator],
})
export class StreamReplyRouterModule {}
