import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { StreamAssistantReplyModule } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.module';
import { StreamTutorReplyModule } from '../stream-tutor-reply-orchestrator/stream-tutor-reply.module';
import { StreamReplyRouterOrchestrator } from './stream-reply-router.orchestrator';

@Module({
  imports: [
    ConversationsModule,
    StreamAssistantReplyModule,
    StreamTutorReplyModule,
  ],
  providers: [StreamReplyRouterOrchestrator],
  exports: [StreamReplyRouterOrchestrator],
})
export class StreamReplyRouterModule {}
