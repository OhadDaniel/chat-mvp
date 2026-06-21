import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { ListConversationsOrchestrator } from './list-conversations.orchestrator';

@Module({
  imports: [ConversationsModule, UsersModule],
  providers: [ListConversationsOrchestrator],
  exports: [ListConversationsOrchestrator],
})
export class ListConversationsModule {}
