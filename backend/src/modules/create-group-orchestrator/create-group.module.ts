import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { CreateGroupOrchestrator } from './create-group.orchestrator';

@Module({
  imports: [UsersModule, ConversationsModule],
  providers: [CreateGroupOrchestrator],
  exports: [CreateGroupOrchestrator],
})
export class CreateGroupModule {}
