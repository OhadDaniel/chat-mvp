import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { SetPinnedOrchestrator } from './set-pinned.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [SetPinnedOrchestrator],
  exports: [SetPinnedOrchestrator],
})
export class SetPinnedModule {}
