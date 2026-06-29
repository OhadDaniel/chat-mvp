import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { StorageModule } from '../storage/storage.module';
import { SetTutorAvatarOrchestrator } from './set-tutor-avatar.orchestrator';

@Module({
  imports: [ConversationsModule, StorageModule],
  providers: [SetTutorAvatarOrchestrator],
  exports: [SetTutorAvatarOrchestrator],
})
export class SetTutorAvatarModule {}
