import { Module } from '@nestjs/common';
import { CreateConversationModule } from '../create-conversation-orchestrator/create-conversation.module';
import { CreateGroupModule } from '../create-group-orchestrator/create-group.module';
import { CreateAssistantConversationModule } from '../create-assistant-conversation-orchestrator/create-assistant-conversation.module';
import { CreateTutorConversationModule } from '../create-tutor-conversation-orchestrator/create-tutor-conversation.module';
import { CreateConversationRouterOrchestrator } from './create-conversation-router.orchestrator';

@Module({
  imports: [
    CreateConversationModule,
    CreateGroupModule,
    CreateAssistantConversationModule,
    CreateTutorConversationModule,
  ],
  providers: [CreateConversationRouterOrchestrator],
  exports: [CreateConversationRouterOrchestrator],
})
export class CreateConversationRouterModule {}
