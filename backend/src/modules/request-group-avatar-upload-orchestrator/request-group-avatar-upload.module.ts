import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { StorageModule } from '../storage/storage.module';
import { RequestGroupAvatarUploadOrchestrator } from './request-group-avatar-upload.orchestrator';

@Module({
  imports: [ConversationsModule, StorageModule],
  providers: [RequestGroupAvatarUploadOrchestrator],
  exports: [RequestGroupAvatarUploadOrchestrator],
})
export class RequestGroupAvatarUploadModule {}
