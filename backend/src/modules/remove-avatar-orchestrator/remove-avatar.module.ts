import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

@Module({
  imports: [UsersModule, StorageModule],
  providers: [RemoveAvatarOrchestrator],
  exports: [RemoveAvatarOrchestrator],
})
export class RemoveAvatarModule {}
