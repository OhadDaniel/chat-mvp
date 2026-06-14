import { Module } from '@nestjs/common';
import { ConversationsModule } from '../../conversations.module';
import { SetPinnedOrchestrator } from './set-pinned.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [SetPinnedOrchestrator],
  exports: [SetPinnedOrchestrator],
})
export class SetPinnedOrchestratorModule {}
