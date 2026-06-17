import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { SetAvatarOrchestrator } from './set-avatar.orchestrator';

@Module({
  imports: [UsersModule, StorageModule, ConversationsModule],
  providers: [SetAvatarOrchestrator],
  exports: [SetAvatarOrchestrator],
})
export class SetAvatarModule {}
