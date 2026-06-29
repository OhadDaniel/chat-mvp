import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { CreateAssistantConversationOrchestrator } from './create-assistant-conversation.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [CreateAssistantConversationOrchestrator],
  exports: [CreateAssistantConversationOrchestrator],
})
export class CreateAssistantConversationModule {}
