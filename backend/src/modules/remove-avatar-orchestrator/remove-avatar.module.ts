import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

@Module({
  imports: [UsersModule, StorageModule, ConversationsModule],
  providers: [RemoveAvatarOrchestrator],
  exports: [RemoveAvatarOrchestrator],
})
export class RemoveAvatarModule {}
