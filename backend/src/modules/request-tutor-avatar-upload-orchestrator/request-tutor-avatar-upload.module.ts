import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { StorageModule } from '../storage/storage.module';
import { RequestTutorAvatarUploadOrchestrator } from './request-tutor-avatar-upload.orchestrator';

@Module({
  imports: [ConversationsModule, StorageModule],
  providers: [RequestTutorAvatarUploadOrchestrator],
  exports: [RequestTutorAvatarUploadOrchestrator],
})
export class RequestTutorAvatarUploadModule {}
