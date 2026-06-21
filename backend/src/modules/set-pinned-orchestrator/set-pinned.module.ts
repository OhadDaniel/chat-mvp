import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { SetPinnedOrchestrator } from './set-pinned.orchestrator';

@Module({
  imports: [ConversationsModule, UsersModule],
  providers: [SetPinnedOrchestrator],
  exports: [SetPinnedOrchestrator],
})
export class SetPinnedModule {}
