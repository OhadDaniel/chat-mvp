import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ListConversationsOrchestrator } from './list-conversations.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [ListConversationsOrchestrator],
  exports: [ListConversationsOrchestrator],
})
export class ListConversationsModule {}
