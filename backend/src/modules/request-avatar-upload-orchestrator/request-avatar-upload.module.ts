import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { RequestAvatarUploadOrchestrator } from './request-avatar-upload.orchestrator';

@Module({
  imports: [StorageModule],
  providers: [RequestAvatarUploadOrchestrator],
  exports: [RequestAvatarUploadOrchestrator],
})
export class RequestAvatarUploadModule {}
