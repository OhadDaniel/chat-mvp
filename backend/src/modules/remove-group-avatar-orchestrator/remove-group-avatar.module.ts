import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { RemoveGroupAvatarOrchestrator } from './remove-group-avatar.orchestrator';

@Module({
  imports: [ConversationsModule, UsersModule],
  providers: [RemoveGroupAvatarOrchestrator],
  exports: [RemoveGroupAvatarOrchestrator],
})
export class RemoveGroupAvatarModule {}
