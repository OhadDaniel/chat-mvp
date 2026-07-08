import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { SetGroupAvatarOrchestrator } from './set-group-avatar.orchestrator';

@Module({
  imports: [ConversationsModule, UsersModule, StorageModule],
  providers: [SetGroupAvatarOrchestrator],
  exports: [SetGroupAvatarOrchestrator],
})
export class SetGroupAvatarModule {}
