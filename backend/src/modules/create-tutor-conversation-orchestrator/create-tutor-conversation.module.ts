import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { CreateTutorConversationOrchestrator } from './create-tutor-conversation.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [CreateTutorConversationOrchestrator],
  exports: [CreateTutorConversationOrchestrator],
})
export class CreateTutorConversationModule {}
