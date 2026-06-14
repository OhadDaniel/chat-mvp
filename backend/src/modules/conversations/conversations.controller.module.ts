import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConversationsController } from './conversations.controller';
import { ListConversationsOrchestratorModule } from './orchestrators/list-conversations/list-conversations.orchestrator.module';
import { CreateConversationOrchestratorModule } from './orchestrators/create-conversation/create-conversation.orchestrator.module';
import { SetPinnedOrchestratorModule } from './orchestrators/set-pinned/set-pinned.orchestrator.module';

@Module({
  imports: [
    AuthModule, // JWT guard pipeline
    ListConversationsOrchestratorModule,
    CreateConversationOrchestratorModule,
    SetPinnedOrchestratorModule,
  ],
  controllers: [ConversationsController],
})
export class ConversationsControllerModule {}
