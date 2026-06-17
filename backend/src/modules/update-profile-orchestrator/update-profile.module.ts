import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { UpdateProfileOrchestrator } from './update-profile.orchestrator';

@Module({
  imports: [UsersModule, ConversationsModule],
  providers: [UpdateProfileOrchestrator],
  exports: [UpdateProfileOrchestrator],
})
export class UpdateProfileModule {}
