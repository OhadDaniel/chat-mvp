import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { RenameTutorOrchestrator } from './rename-tutor.orchestrator';

@Module({
  imports: [ConversationsModule],
  providers: [RenameTutorOrchestrator],
  exports: [RenameTutorOrchestrator],
})
export class RenameTutorModule {}
