import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { RenameGroupOrchestrator } from './rename-group.orchestrator';

@Module({
  imports: [ConversationsModule, UsersModule],
  providers: [RenameGroupOrchestrator],
  exports: [RenameGroupOrchestrator],
})
export class RenameGroupModule {}
