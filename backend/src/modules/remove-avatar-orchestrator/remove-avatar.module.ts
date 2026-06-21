import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

@Module({
  imports: [UsersModule],
  providers: [RemoveAvatarOrchestrator],
  exports: [RemoveAvatarOrchestrator],
})
export class RemoveAvatarModule {}
