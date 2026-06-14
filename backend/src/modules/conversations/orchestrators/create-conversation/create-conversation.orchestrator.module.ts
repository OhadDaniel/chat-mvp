import { Module } from '@nestjs/common';
import { UsersModule } from '../../../users/users.module';
import { ConversationsModule } from '../../conversations.module';
import { CreateConversationOrchestrator } from './create-conversation.orchestrator';

@Module({
  imports: [UsersModule, ConversationsModule],
  providers: [CreateConversationOrchestrator],
  exports: [CreateConversationOrchestrator],
})
export class CreateConversationOrchestratorModule {}
