import { Module } from '@nestjs/common';
import { ConversationsModule } from '../../../conversations/conversations.module';
import { MessagesModule } from '../../messages.module';
import { CreateMessageOrchestrator } from './create-message.orchestrator';

@Module({
  imports: [ConversationsModule, MessagesModule],
  providers: [CreateMessageOrchestrator],
  exports: [CreateMessageOrchestrator],
})
export class CreateMessageOrchestratorModule {}
